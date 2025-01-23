import { EmergencyContact } from "@index/entity/EmergencyContact";
import { Family } from "@index/entity/Family";
import { Guardian } from "@index/entity/Guardian";
import { Student } from "@index/entity/Student";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";import { AccountInformationComment } from "@index/entity/AccountInformationComment";
import { Feedback } from "@index/entity/Feedback";

export default  class AccountInformationController extends GenericController{
    constructor() {
        super(Family);
    }

    async getAll(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getAllService(reqHandler, async (jwtData, httpExec, page: number, size: number) => {
           
            try {
                const entities = await this.getRepository().findAll(
                    reqHandler.getLogicalDelete(),
                    reqHandler.getFilters(),
                    page,
                    size
                );

                if (!entities || entities.length === 0) {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                const guardianRepository = await new GenericRepository(Guardian);
                const studentRepository = await new GenericRepository(Student);
                const emergencyContactRepository = await new GenericRepository(EmergencyContact);
                const commentRepository = await new GenericRepository(AccountInformationComment);
                const feedbackRepository = await new GenericRepository(Feedback);

                for (const family of entities) {

                    const filters: FindManyOptions = {};
                    filters.where = { 
                        family: {
                            id: family.id
                        }, 
                        is_deleted: false
                    };

                    const guardians = await guardianRepository.findByOptions(true, true, filters);
                    const students = await studentRepository.findByOptions(true, true, filters);
                    const emergencyContacts = await emergencyContactRepository.findByOptions(true, true, filters);
                    const comments = await commentRepository.findByOptions(false, true, 
                    { 
                        where: {
                            family: {
                                id: family.id
                            }
                        }
                    });
                    const feedbacks = await feedbackRepository.findByOptions(true, true, filters);
                 
                    family.guardians = guardians;
                    family.students = students;
                    family.emergencyContacts = emergencyContacts;
                    family.comments = comments;
                    family.feedbacks = feedbacks;
                }

                return httpExec.successAction(
                    reqHandler.getAdapter().entitiesToResponse(entities),
                    ConstHTTPRequest.GET_ALL_SUCCESS
                );
            } catch (error: any) {
                return httpExec.databaseError(
                    error,
                    jwtData.id.toString(),
                    reqHandler.getMethod(),
                    this.getControllerName()
                );
            }
        });
    }
}