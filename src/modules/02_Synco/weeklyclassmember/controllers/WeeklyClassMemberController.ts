import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import JWTObject from "@TenshiJS/objects/JWTObject";

export default  class WeeklyClassMemberController extends GenericController{

    constructor() {
        super(WeeklyClassMember);
    }

    private formatPercentage(value: number): string {
        return `${(value * 100).toFixed(2)}%`;
    }


    async generateWeeklyReport(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, 
            async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
    
            try {
            
                const reportTimeframe = 7;
                const now = new Date();
                const timeThreshold = new Date(now.getTime() - reportTimeframe * 24 * 60 * 60 * 1000);
        
                const allMembers =  await this.getRepository().findAll(
                                    reqHandler.getLogicalDelete(), 
                                    reqHandler.getFilters(),
                                    1, 10000
                                    );
        
                if (allMembers == null || !allMembers.length) {
                    return httpExec.dynamicError(
                        ConstStatusJson.NOT_FOUND,
                        ConstMessagesJson.DONT_EXISTS
                    );
                }
               
                const totalMembers = allMembers.length;
                const previousMembers = allMembers.filter(
                    (member) => new Date(member.created_date).getTime() < timeThreshold.getTime()
                );
                const totalPreviousMembers = previousMembers.length;
        
                const totalMemberIncrease = totalPreviousMembers
                    ? ((totalMembers - totalPreviousMembers) / totalPreviousMembers) * 100
                    : 100;
        
                const activeMembers = allMembers.filter((member) => {
                    return (
                        !['PAY_PENDING_MS', 'FROZEN_MS', 'CANCELLED_MS'].includes(member.member_status_code.code) 
                    );
                });
        
                const totalActiveMembers = activeMembers.length;
                const totalRevenue = activeMembers.reduce((transactionSum: number, member) => {
                    return (
                        transactionSum +
                        (member.payment?.paymentTransactions.reduce(
                            (txnSum: number, txn: { price: number }) => txnSum + txn.price, 0
                        ) || 0)
                    );
                }, 0);
        
                const monthlyRevenue = totalRevenue / 12;
                const averageMonthlyFee = totalActiveMembers
                    ? monthlyRevenue / totalActiveMembers
                    : 0;
        
             
                const previousActiveMembers = activeMembers.filter(
                    (member) => new Date(member.created_at).getTime() < timeThreshold.getTime()
                );
                const totalPreviousActiveMembers = previousActiveMembers.length;
        
                let revenueIncrease = 100;
                let avgMonthlyRevenueIncrease = 100;
        
                if (totalPreviousActiveMembers > 0) {
                    const previousRevenue = previousActiveMembers.reduce((transactionSum: number, member) => {
                        return (
                            transactionSum +
                            (member.payment?.paymentTransactions.reduce(
                                (txnSum: number, txn: { price: number }) => txnSum + txn.price, 0
                            ) || 0)
                        );
                    }, 0);
        
                    const previousMonthlyRevenue = previousRevenue / 12;
                    const previousAverageFee = previousMonthlyRevenue / totalPreviousActiveMembers;
        
                    if (previousRevenue > 0) {
                        revenueIncrease =
                            ((totalRevenue - previousRevenue) / previousRevenue) * 100;
                    }
        
                    if (previousAverageFee > 0) {
                        avgMonthlyRevenueIncrease =
                            ((averageMonthlyFee - previousAverageFee) / previousAverageFee) * 100;
                    }
                }
        
           
                const payload = {
                    total_students: {
                        amount: totalMembers,
                        percentage: this.formatPercentage(totalMemberIncrease),
                    },
                    monthly_revenue: {
                        amount: totalRevenue.toFixed(2),
                        percentage: this.formatPercentage(revenueIncrease),
                    },
                    average_monthly_fee: {
                        amount: averageMonthlyFee.toFixed(2),
                        percentage: this.formatPercentage(avgMonthlyRevenueIncrease),
                    },
                };
        
                return httpExec.successAction(payload, ConstHTTPRequest.GET_ALL_SUCCESS);
            } catch (error: any) {
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
    
        });
    }
    

   
}
    
    

