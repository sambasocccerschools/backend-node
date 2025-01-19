//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

//set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { DataSource } from 'typeorm';
import { UnitDynamicCentral } from '@index/entity/UnitDynamicCentral';


async function createDatabaseIfNotExists() {
  // Step 1: Connect to MySQL without specifying a database
  const tempDataSource = new DataSource({
      type: config.DB.TYPE, // Type of the database
      host: config.DB.HOST, // Host of the database
      port: config.DB.PORT, // Port of the database
      username: config.DB.USER, // Usertitle for the database
      password: config.DB.PASSWORD, // Password for the database
  });

  await tempDataSource.initialize();

  // Step 2: Create the database if it does not exist
  await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
  await tempDataSource.destroy(); // Close the temporary connection
}


async function runSeed() {
 
    await createDatabaseIfNotExists();
    /*
        Init Datasource
    */
    const dataSource = new DataSource({
        type: config.DB.TYPE, // Type of the database
        host: config.DB.HOST, // Host of the database
        port: config.DB.PORT, // Port of the database
        username: config.DB.USER, // Usertitle for the database
        password: config.DB.PASSWORD, // Password for the database
        database: config.DB.NAME, // Name of the database
        entities: [UnitDynamicCentral], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        extra: {
            connectionLimit: 150, 
        },
    });
    

    await dataSource.initialize();



    /*
        Unit Dynamic Central Data Set
    */
    const udcRepository = dataSource.getRepository(UnitDynamicCentral);

    //Camp Types
    const udcCampTypes = [
        { title: "Half-Term Camp", code: "HALF_TERM_CAMP", type: "CAMP_TYPES", slug: "half-term-camp" },
        { title: "Christmas Camp", code: "CHRISTMAS_CAMP", type: "CAMP_TYPES", slug: "christmas-camp" },
        { title: "Easter Camp", code: "EASTER_CAMP", type: "CAMP_TYPES", slug: "easter-camp" },
        { title: "Summer Camp", code: "SUMMER_CAMP", type: "CAMP_TYPES", slug: "summer-camp" }
    ];
    await udcRepository.upsert(udcCampTypes, ["code"]);


    // Event Types
    const udcEventTypes = [
        { title: "User Changes", code: "USER_CHANGES_ET", type: "EVENT_TYPES", slug: "user-changes" },
        { title: "Submit Feedback", code: "SUBMIT_FEEDBACK_ET", type: "EVENT_TYPES", slug: "submit-feedback" },
        { title: "Add to Waiting List", code: "ADD_TO_WAITING_LIST_ET", type: "EVENT_TYPES", slug: "add-to-waiting-list" },
        { title: "Book Free Trial", code: "BOOK_FREE_TRIAL_ET", type: "EVENT_TYPES", slug: "book-free-trial" },
        { title: "Book Membership", code: "BOOK_MEMBERSHIP_ET", type: "EVENT_TYPES", slug: "book-membership" },
        { title: "Request to Cancel", code: "REQUEST_TO_CANCEL_ET", type: "EVENT_TYPES", slug: "request-to-cancel" },
        { title: "Cancelled", code: "CANCELLED_ET", type: "EVENT_TYPES", slug: "cancelled" },
        { title: "Frozen", code: "FROZEN_ET", type: "EVENT_TYPES", slug: "frozen" }
    ];
    await udcRepository.upsert(udcEventTypes, ["code"]);


    //Feedback Categories
    const feedbackCategories = [
        { title: "Coaches", code: "COACHES", type: "FEEDBACK_CATEGORIES", slug: "coaches" },
        { title: "Facilities", code: "FACILITIES", type: "FEEDBACK_CATEGORIES", slug: "facilities" },
        { title: "Quality of Coaching", code: "QUALITY_OF_COACHING", type: "FEEDBACK_CATEGORIES", slug: "quality-of-coaching" },
        { title: "Customer Service", code: "CUSTOMER_SERVICE", type: "FEEDBACK_CATEGORIES", slug: "customer-service" },
        { title: "Management", code: "MANAGEMENT", type: "FEEDBACK_CATEGORIES", slug: "management" },
        { title: "Other", code: "OTHER", type: "FEEDBACK_CATEGORIES", slug: "other" }
    ];
    await udcRepository.upsert(feedbackCategories, ["code"]);
    

    //Feedback Status
    const feedbackStatus = [
        { title: "Pending", code: "PENDING_FS", type: "FEEDBACK_STATUS", slug: "pending" },
        { title: "In Progress", code: "IN_PROGRESS_FS", type: "FEEDBACK_STATUS", slug: "in-progress" },
        { title: "Solved", code: "SOLVED_FS", type: "FEEDBACK_STATUS", slug: "solved" },
        { title: "Archived", code: "ARCHIVED_FS", type: "FEEDBACK_STATUS", slug: "archived" }
    ];
    await udcRepository.upsert(feedbackStatus, ["code"]);


    //feedback Types
    const feedbackTypes = [
        { title: "Positive", code: "POSITIVE_FT", type: "FEEDBACK_TYPES", slug: "positive" },
        { title: "Negative", code: "NEGATIVE_FT", type: "FEEDBACK_TYPES", slug: "negative" }
    ];
    await udcRepository.upsert(feedbackTypes, ["code"]);


    //Free Trial Status
    const freeTrialStatus = [
        { title: "Pending", code: "PENDING_FTS", type: "FREE_TRIAL_STATUS", slug: "pending" },
        { title: "Not Attended", code: "NOT_ATTENDED_FTS", type: "FREE_TRIAL_STATUS", slug: "not-attended" },
        { title: "Rebooks", code: "ATTENDED_FTS", type: "FREE_TRIAL_STATUS", slug: "rebooks" }
    ];
    await udcRepository.upsert(freeTrialStatus, ["code"]);


    //Guardian Referee Status
    const guardianRefereeStatus = [
        { title: "Pending", code: "PENDING_GRS", type: "GUARDIAN_REFEREE_STATUS", slug: "pending" },
        { title: "Success", code: "SUCCESS_GRS", type: "GUARDIAN_REFEREE_STATUS", slug: "success" }
    ];
    await udcRepository.upsert(guardianRefereeStatus, ["code"]);


    //Lead Status
    const leadStatus = [
        { title: "Active", code: "ACTIVE_LS", type: "LEAD_STATUS", slug: "active" },
        { title: "Call Pending", code: "CALL_PENDING_LS", type: "LEAD_STATUS", slug: "call-pending" },
        { title: "Not Interested", code: "NOT_INTERESTED_LS", type: "LEAD_STATUS", slug: "not-interested" },
        { title: "Purchased", code: "PURCHASED_LS", type: "LEAD_STATUS", slug: "purchased" }
    ];
    await udcRepository.upsert(leadStatus, ["code"]);
    
    //Member Cancel Status
    const memberCancelStatus = [
        { title: "Request to Cancel", code: "REQUEST_TO_CANCEL_MCS", type: "MEMBER_CANCEL_STATUS", slug: "request-to-cancel" },
        { title: "Cancelled", code: "CANCELLED_MCS", type: "MEMBER_CANCEL_STATUS", slug: "cancelled" },
        { title: "Cancellation Rejected", code: "CANCELLATION_REJECTED_MCS", type: "MEMBER_CANCEL_STATUS", slug: "cancellation-rejected" }
    ];
    await udcRepository.upsert(memberCancelStatus, ["code"]);
    

    //Member Cancel Types
    const memberCancelTypes = [
        { title: "Cancel membership with immediate effect", value1: "Full Cancellation", code: "FULL_CANCELLATION", type: "MEMBER_CANCEL_TYPES" },
        { title: "Request to cancel membership", value1: "Request to Cancel", code: "REQUEST_TO_CANCEL", type: "MEMBER_CANCEL_TYPES" }
    ];
    await udcRepository.upsert(memberCancelTypes, ["code"]);


    //Member Status
    const memberStatus = [
        { title: "Pay Pending", code: "PAY_PENDING_MS", type: "MEMBER_STATUS", slug: "pay-pending" },
        { title: "Active", code: "ACTIVE_MS", type: "MEMBER_STATUS", slug: "active" },
        { title: "Frozen", code: "FROZEN_MS", type: "MEMBER_STATUS", slug: "frozen" },
        { title: "Request Cancel", code: "REQUEST_CANCEL_MS", type: "MEMBER_STATUS", slug: "request-cancel" },
        { title: "Cancelled", code: "CANCELLED_MS", type: "MEMBER_STATUS", slug: "cancelled" }
    ];
    await udcRepository.upsert(memberStatus, ["code"]);


    //Membership Cancel Reason Categories
    const membershipCancelReasonCategories = [
        { title: "Financial Constraints", code: "FINANCIAL_CONST", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "financial-constraints" },
        { title: "Child’s Health Issues", code: "CHILD_HEALTH_ISSUES", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "child-health-issues" },
        { title: "Scheduling Conflicts", code: "SCHEDULING_CONFLICTS", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "scheduling-conflicts" },
        { title: "Dissatisfaction with Program", code: "DISSATISFACTION_WITH_PROGRAM", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "dissatisfaction-with-program" },
        { title: "Social Issues", code: "SOCIAL_ISSUES", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "social-issues" },
        { title: "Relocation", code: "RELOCATION", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "relocation" },
        { title: "Parental Preferences", code: "PARENTAL_PREFERENCES", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "parental-preferences" },
        { title: "Travel and Logistics", code: "TRAVEL_AND_LOGISTICS", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "travel-and-logistics" },
        { title: "Behavioral Issues", code: "BEHAVIORAL_ISSUES", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "behavioral-issues" },
        { title: "Other (Please specify)", code: "OTHER", type: "MEMBERSHIP_CANCEL_REASON_CATEGORIES", slug: "other" }
    ];
    await udcRepository.upsert(membershipCancelReasonCategories, ["code"]);
    

    //Membership Cancel Reasons
    const membershipCancelReasons = [
        { title: 'Unexpected financial difficulties', code: 'UFD', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'unexpected-financial-difficulties', father_code: "FINANCIAL_CONST" },
        { title: 'Membership fees becoming unaffordable', code: 'MFUA', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'fees-unaffordable', father_code: "FINANCIAL_CONST" },

        { title: 'Physical injuries', code: 'PI', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'physical-injuries', father_code: "CHILD_HEALTH_ISSUES" },
        { title: 'Chronic health conditions requiring rest', code: 'CHCR', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'chronic-health-conditions', father_code: "CHILD_HEALTH_ISSUES" },
        { title: 'Temporary illnesses', code: 'TI', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'temporary-illnesses', father_code: "CHILD_HEALTH_ISSUES" },
       
        { title: 'Clashes with school or other extracurricular activities', code: 'CSA', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'clashes-with-school-activities', father_code: "SCHEDULING_CONFLICTS" },
        { title: 'Family commitments or changes in family schedule', code: 'FCCFS', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'family-commitments', father_code: "SCHEDULING_CONFLICTS" },

        { title: 'Perceived lack of progress or development', code: 'PLPD', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'lack-of-progress', father_code: "DISSATISFACTION_WITH_PROGRAM" },
        { title: 'Inadequate coaching quality', code: 'ICQ', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'inadequate-coaching', father_code: "DISSATISFACTION_WITH_PROGRAM" },
        { title: 'Poor organisation or management', code: 'POM', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'poor-management', father_code: "DISSATISFACTION_WITH_PROGRAM" },
        { title: 'Lack of communication from the soccer school', code: 'LCSS', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'lack-of-communication', father_code: "DISSATISFACTION_WITH_PROGRAM" },
        
        { title: 'Bullying or conflicts with other children', code: 'BOC', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'bullying-conflicts', father_code: "SOCIAL_ISSUES" },
        { title: 'Child’s Disinterest', code: 'CD', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'child-disinterest', father_code: "SOCIAL_ISSUES" },
        { title: 'Loss of interest in soccer', code: 'LIS', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'lost-interest', father_code: "SOCIAL_ISSUES" },
        { title: 'Preference for other sports or activities', code: 'POSA', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'preference-other-activities', father_code: "SOCIAL_ISSUES" },
       
        { title: 'Moving to a different area or city', code: 'MDAC', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'moving-different-area', father_code: "RELOCATION" },
      
        { title: 'Preferencing another soccer school or sports program', code: 'PASS', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'other-soccer-school', father_code: "PARENTAL_PREFERENCES" },
        { title: 'Concerns over safety or coaching methods', code: 'CSCM', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'safety-coaching-concerns', father_code: "PARENTAL_PREFERENCES" },
        { title: 'Ethical or philosophical disagreements with the program’s policies', code: 'EPD', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'ethical-disagreements', father_code: "PARENTAL_PREFERENCES" },
        
        { title: 'Distance from home to the soccer school being too far', code: 'DFH', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'distance-too-far', father_code: "TRAVEL_AND_LOGISTICS" },
        { title: 'Difficulty in arranging transportation', code: 'DAT', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'transportation-difficulty', father_code: "TRAVEL_AND_LOGISTICS" },
        
        { title: 'Child’s misbehavior leading to disciplinary action', code: 'CMDA', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'disciplinary-action', father_code: "BEHAVIORAL_ISSUES" },
        { title: 'Parental decision to enforce consequences for behavior at home or school', code: 'PDEC', type: 'MEMBERSHIP_CANCEL_REASONS', slug: 'parental-decision', father_code: "BEHAVIORAL_ISSUES" }
      ];
      await udcRepository.upsert(membershipCancelReasons, ["code"]);
      

      // MEMBERSHIP FREEZE REASONS
      const membershipFreezeReasons = [
        { title: "Financial Constraints", code: "FINANCIAL_CONST", type: "MEMBERSHIP_FREEZE_REASONS", slug: "financial-constraints" },
        { title: "Child Injury", code: "CHILD_INJURY", type: "MEMBERSHIP_FREEZE_REASONS", slug: "child-injury" },
        { title: "Holiday", code: "HOLIDAY", type: "MEMBERSHIP_FREEZE_REASONS", slug: "holiday" },
        { title: "Other", code: "OTHER", type: "MEMBERSHIP_FREEZE_REASONS", slug: "other" }
      ];
      await udcRepository.upsert(membershipFreezeReasons, ["code"]);
      

      // PAYMENT TYPES
      const paymentTypes = [
        { title: "Access Paysuite", code: "ACCESS_PAYSUITE", type: "PAYMENT_TYPES", slug: "access-paysuite" }
      ];
      await udcRepository.upsert(paymentTypes, ["code"]);
      

      // REFERRAL SOURCES
      const referralSources = [
        { title: "Facebook", code: "FACEBOOK", type: "REFERRAL_SOURCES", slug: "facebook" },
        { title: "Instagram", code: "INSTAGRAM", type: "REFERRAL_SOURCES", slug: "instagram" },
        { title: "Referral (word of mouth)", code: "REFERRAL_WORD_OF_MOUTH", type: "REFERRAL_SOURCES", slug: "referral" },
        { title: "Google Search", code: "GOOGLE_SEARCH", type: "REFERRAL_SOURCES", slug: "google" },
        { title: "Flyer", code: "FLYER", type: "REFERRAL_SOURCES", slug: "flyer" },
        { title: "Other", code: "OTHER", type: "REFERRAL_SOURCES", slug: "other" }
      ];
      await udcRepository.upsert(referralSources, ["code"]);


      // REGIONS
      const regions = [
        { title: "North", code: "NORTH", type: "REGIONS", slug: "north" },
        { title: "East", code: "EAST", type: "REGIONS", slug: "east" },
        { title: "South", code: "SOUTH", type: "REGIONS", slug: "south" },
        { title: "West", code: "WEST", type: "REGIONS", slug: "west" }
      ];
      await udcRepository.upsert(regions, ["code"]);
      

      // RELATIONSHIP TYPES
      const relationships = [
        { title: "Father", code: "FATHER", type: "RELATIONSHIP_TYPES", slug: "father" },
        { title: "Mother", code: "MOTHER", type: "RELATIONSHIP_TYPES", slug: "mother" },
        { title: "Grandparent", code: "GRANDPARENT", type: "RELATIONSHIP_TYPES", slug: "grandparent" },
        { title: "Guardian", code: "GUARDIAN", type: "RELATIONSHIP_TYPES", slug: "guardian" },
        { title: "Other", code: "OTHER", type: "RELATIONSHIP_TYPES", slug: "other" }
      ];
      await udcRepository.upsert(relationships, ["code"]);
      

      // SALE STATUS
      const saleStatus = [
        { title: "Active", code: "ACTIVE_SS", type: "SALE_STATUS", slug: "active" },
        { title: "Inactive", code: "INACTIVE_SS", type: "SALE_STATUS", slug: "inactive" }
      ];
      await udcRepository.upsert(saleStatus, ["code"]);
      

      // SEASONS
      const seasons = [
        { title: "Spring", code: "SPRING", type: "SEASONS", slug: "spring" },
        { title: "Summer", code: "SUMMER", type: "SEASONS", slug: "summer" },
        { title: "Autumn", code: "AUTUMN", type: "SEASONS", slug: "autumn" }
      ];
      await udcRepository.upsert(seasons, ["code"]);


      // SERVICES
      const services = [
        { title: "Weekly Classes", code: "WEEKLY_CLASSES", type: "SERVICES", slug: "weekly-classes" },
        { title: "One to One", code: "ONE_TO_ONE", type: "SERVICES", slug: "one-to-one" },
        { title: "Holiday Camps", code: "HOLIDAY_CAMPS", type: "SERVICES", slug: "holiday-camps" },
        { title: "Birthday Parties", code: "BIRTHDAY_PARTIES", type: "SERVICES", slug: "birthday-parties" },
        { title: "Club", code: "CLUB", type: "SERVICES", slug: "club" }
      ];
      await udcRepository.upsert(services, ["code"]);
      

      // SERVICE PACKAGES
      const servicePackages = [
        { title: "Gold", code: "GOLD", type: "SERVICE_PACKAGES", slug: "gold", father_code: "ONE_TO_ONE" },
        { title: "Silver", code: "SILVER", type: "SERVICE_PACKAGES", slug: "silver", father_code: "ONE_TO_ONE" },
        { title: "4 Days", code: "FOUR_DAYS", type: "SERVICE_PACKAGES", slug: "4-days", father_code: "HOLIDAY_CAMPS" },
        { title: "5 Days", code: "FIVE_DAYS", type: "SERVICE_PACKAGES", slug: "5-days", father_code: "HOLIDAY_CAMPS" },
        { title: "Gold", code: "GOLD_PARTY", type: "SERVICE_PACKAGES", slug: "gold-party", father_code: "BIRTHDAY_PARTIES" },
        { title: "Silver", code: "SILVER_PARTY", type: "SERVICE_PACKAGES", slug: "silver-party", father_code: "BIRTHDAY_PARTIES" }
      ];
      await udcRepository.upsert(servicePackages, ["code"]);


      // STUDENT COVERAGES
      const studentCoverages = [
        { title: "1 Student", code: "ONE_STUDENT", type: "STUDENT_COVERAGES", slug: "1-student" },
        { title: "2 Students", code: "TWO_STUDENTS", type: "STUDENT_COVERAGES", slug: "2-students" },
        { title: "3 Students", code: "THREE_STUDENTS", type: "STUDENT_COVERAGES", slug: "3-students" },
        { title: "4 Students", code: "FOUR_STUDENTS", type: "STUDENT_COVERAGES", slug: "4-students" }
      ];
      await udcRepository.upsert(studentCoverages, ["code"]);
      

      // WAITING LIST STATUSES
      const waitingListStatus = [
        { title: "Pending", code: "PENDING", type: "WAITING_LIST_STATUS", slug: "pending" },
        { title: "Booked Trial", code: "BOOKED_TRIAL", type: "WAITING_LIST_STATUS", slug: "booked-trial" },
        { title: "Booked Membership", code: "BOOKED_MEMBERSHIP", type: "WAITING_LIST_STATUS", slug: "booked-membership" },
        { title: "Cancelled", code: "CANCELLED", type: "WAITING_LIST_STATUS", slug: "cancelled" }
      ];
      await udcRepository.upsert(waitingListStatus, ["code"]);

      console.log("General seed done!");
}

runSeed().catch((error) => console.error(error));