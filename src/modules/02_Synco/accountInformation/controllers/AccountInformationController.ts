import { EmergencyContact } from "@index/entity/EmergencyContact";
import { Family } from "@index/entity/Family";
import { Guardian } from "@index/entity/Guardian";
import { Student } from "@index/entity/Student";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";import { AccountInformationComment } from "@index/entity/AccountInformationComment";
import { Feedback } from "@index/entity/Feedback";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";

export default  class AccountInformationController extends GenericController{

    private guardianRepository = new GenericRepository(Guardian);
    private studentRepository = new GenericRepository(Student);
    private emergencyContactRepository = new GenericRepository(EmergencyContact);
    private commentRepository = new GenericRepository(AccountInformationComment);
    private feedbackRepository = new GenericRepository(Feedback);
    private weeklyClassMemberRepository = new GenericRepository(WeeklyClassMember);

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

                for (const family of entities) {
                    await this.populateFamilyRelations(family);
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

    async getById(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getByIdService(reqHandler, async (jwtData, httpExec, id) => {
            try {
                const family = await this.getRepository().findById(id, reqHandler.getLogicalDelete(), reqHandler.getFilters());

                if (!family) {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                await this.populateFamilyRelations(family);

                return httpExec.successAction(
                    reqHandler.getAdapter().entityToResponse(family),
                    ConstHTTPRequest.GET_BY_ID_SUCCESS
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

    private async populateFamilyRelations(family: any): Promise<void> {
        const filters: FindManyOptions = {
            where: { 
                family: { id: family.id }, 
                is_deleted: false
            }
        };

        const guardians = await this.guardianRepository.findByOptions(true, true, filters);
        const students = await this.studentRepository.findByOptions(true, true, filters);
        const emergencyContacts = await this.emergencyContactRepository.findByOptions(true, true, filters);
        const comments = await this.commentRepository.findByOptions(false, true, {
            where: { family: { id: family.id } }
        });
        const feedbacks = await this.feedbackRepository.findByOptions(true, true, filters);

        const service_history = await this.weeklyClassMemberRepository.findByOptions(true, true, {
            where: { student: { id: students[0] == null ? 0 : students[0].id } },
            relations: ["member_status", "agent", "franchise", "booked_by"]
        });

        family.guardians = guardians;
        family.students = students;
        family.emergency_contacts = emergencyContacts;
        family.service_history = service_history;
        family.comments = comments;
        family.feedbacks = feedbacks;
    }
}