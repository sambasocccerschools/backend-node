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
import { Franchise } from '@index/entity/Franchise';
import { User } from '@TenshiJS/entity/User';
import { Venue } from '@index/entity/Venue';
import { Uniform } from '@index/entity/Uniform';
import { AbilityGroup } from '@index/entity/AbilityGroup';
import { HolidayCampDate } from '@index/entity/HolidayCampDate';
import { SessionPlan } from '@index/entity/SessionPlan';
import { SubscriptionPlan } from '@index/entity/SubscriptionPlan';
import { SubscriptionPlanPrice } from '@index/entity/SubscriptionPlanPrice';
import { Term } from '@index/entity/Term';
import { WeeklyClass } from '@index/entity/WeeklyClass';
import { Family } from '@index/entity/Family';
import { Student } from '@index/entity/Student';
import { WeeklyClassMember } from '@index/entity/WeeklyClassMember';
import { Guardian } from '@index/entity/Guardian';
import { WeeklyClassSale } from '@index/entity/WeeklyClassSale';


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
        entities: [UnitDynamicCentral, 
                    Franchise, 
                    User,
                    Venue,
                    Uniform,
                    AbilityGroup,
                    HolidayCampDate,
                    SessionPlan,
                    SubscriptionPlan,
                    SubscriptionPlanPrice,
                    Term,
                    WeeklyClass,
                    Family,
                    Student,
                    WeeklyClassMember,
                    Guardian,
                    WeeklyClassSale], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        extra: {
            connectionLimit: 150, 
        },
    });
    
    console.log("Start seeding");
    await dataSource.initialize();





    /* **************************************
                    Franchise
    *****************************************/
    const franchiseRepository = dataSource.getRepository(Franchise);
    const referralSourceFranchise = await dataSource
                                .getRepository(UnitDynamicCentral)
                                .findOneBy({ code: "INSTAGRAM" });

    const franchises : Partial<Franchise>[] = [
      {
          id:222,
          first_name: "John",
          last_name: "Doe",
          dob: new Date("1990-05-15"),
          age: 34,
          phone_number: "1234567890",
          email: "john.doe@example.com",
          postal_code: "12345",
          location: "New York",
          liquid_capacity: 500,
          message: "Looking to expand business opportunities.",
          referral_source_code: referralSourceFranchise as UnitDynamicCentral, 
          added_by: null,
          is_deleted: false,
      },
      {
          id:223,
          first_name: "Jane",
          last_name: "Smith",
          dob: new Date("1985-11-30"),
          age: 38,
          phone_number: "0987654321",
          email: "jane.smith@example.com",
          postal_code: "54321",
          location: "Los Angeles",
          liquid_capacity: 300,
          message: "Interested in franchise opportunities.",
          referral_source_code: referralSourceFranchise as UnitDynamicCentral,
          added_by: null,
          is_deleted: false,
      },
  ];

  await franchiseRepository.upsert(franchises as any, ["id"]);

  const franchise = await dataSource
                  .getRepository(Franchise)
                  .findOneBy({ id: 222 });



  /****************************************
                  Venue
  *****************************************/
  const venueRepository = dataSource.getRepository(Venue);
  const regionVenue = await dataSource
                        .getRepository(UnitDynamicCentral)
                        .findOneBy({ code: "NORTH" });
  const venues: Partial<Venue>[] = [
    {
        id: 345,
        area: "Downtown",
        name: "Main Hall",
        facility_enter_guide: "Enter through the east gate.",
        parking_note: "Parking available near the main entrance.",
        address: "123 Main Street, Cityville",
        latitude: 40.7128,
        longitude: -74.0060,
        has_parking: true,
        has_congestion: false,
        price: 500.00,
        franchise_id: franchise, 
        region_code: regionVenue as UnitDynamicCentral,
        is_deleted: false,
    },
    {
      id: 346,
      area: "Uptown",
      name: "Conference Center",
      facility_enter_guide: "Enter through the north gate.",
      parking_note: "Limited parking, use public transportation if possible.",
      address: "456 North Avenue, Cityville",
      latitude: 40.7138,
      longitude: -74.0050,
      has_parking: false,
      has_congestion: true,
      price: 750.50,
      franchise_id: null, // No franchise associated
      region_code: regionVenue as UnitDynamicCentral, // Assuming `region` is retrieved
      is_deleted: false,
    },
    {
      id: 347,
      area: "Suburb",
      name: "Community Center",
      facility_enter_guide: "Enter through the west gate, near the playground.",
      parking_note: "Ample parking available on site.",
      address: "789 Suburb Road, Cityville",
      latitude: 40.7150,
      longitude: -74.0040,
      has_parking: true,
      has_congestion: false,
      price: 300.00,
      franchise_id: null, // Assuming `franchise` is retrieved
      region_code: regionVenue as UnitDynamicCentral, // Assuming `region` is retrieved
      is_deleted: false,
    }
  ];
  await venueRepository.upsert(venues as any, ["id"]);





  /****************************************
                    Uniform
  *****************************************/
  const uniformRepository = dataSource.getRepository(Uniform);
  const uniforms: Partial<Uniform>[] = [
    {
        id: 100,
        title: "Classic Soccer Uniform",
        description: "A classic soccer uniform with breathable fabric and durable stitching.",
        price: 49.99,
        url: "https://soccer-samba-dev-pictures.s3.us-east-2.amazonaws.com/PublicFiles//Front_end_SSS__IMG__18112024170315.png",
        is_deleted: false,
    },
    {
      id: 101,
      title: "Youth Training Kit",
      description: "Designed for young players, this kit includes a jersey, shorts, and socks.",
      price: 29.99,
      url: "https://soccer-samba-dev-pictures.s3.us-east-2.amazonaws.com/PublicFiles//Front_end_SSS__IMG__18112024170315.png",
      is_deleted: false,
    }
  ];
  await uniformRepository.upsert(uniforms as any, ["id"]);





  /****************************************
                AbilityGroup
  *****************************************/
  const abilityGroupsRepository = dataSource.getRepository(AbilityGroup);
  const serviceAbilityGroup = await dataSource
                              .getRepository(UnitDynamicCentral)
                              .findOneBy({ code: "WEEKLY_CLASSES" });


  const servicePackageAbilityGroup = await dataSource
                                    .getRepository(UnitDynamicCentral)
                                    .findOneBy({ code: "GOLD" });
                      

  const abilityGroups: Partial<AbilityGroup>[] = [
    {
        id: 421,
        name: "Youth Training Group",
        min_age: 6,
        max_age: 12,
        franchise_id: franchise, 
        service_code: serviceAbilityGroup as UnitDynamicCentral,  
        service_package_code: servicePackageAbilityGroup as UnitDynamicCentral,  
        is_deleted: false,
    },
    {
      id: 422,
      name: "Adult Fitness Group",
      min_age: 18,
      max_age: 40,
      franchise_id: franchise,  
      service_code: serviceAbilityGroup as UnitDynamicCentral,  
        service_package_code: servicePackageAbilityGroup as UnitDynamicCentral,  
      is_deleted: false,
  }
  ];
  await abilityGroupsRepository.upsert(abilityGroups as any, ["id"]);




  /****************************************
                HolidayCampDate
  *****************************************/
  const holidayCampDatesRepository = dataSource.getRepository(HolidayCampDate);
  const campTypeHolidayCampDate = await dataSource
                              .getRepository(UnitDynamicCentral)
                              .findOneBy({ code: "SUMMER_CAMP" });
  const holidayCampDates: Partial<HolidayCampDate>[] = [
    {
        id: 23,
        name: "Summer Adventure Camp 2024",
        start_date: new Date("2024-06-01"),
        end_date: new Date("2024-06-15"),
        camp_type_code: campTypeHolidayCampDate as UnitDynamicCentral,
        franchise_id: null,
        is_deleted: false,
    },
    {
      id: 24,
      name: "Winter Camp for Kids",
      start_date: new Date("2024-12-15"),
      end_date: new Date("2024-12-30"),
      camp_type_code: campTypeHolidayCampDate as UnitDynamicCentral,
      franchise_id: franchise,  
      is_deleted: false,
    },
    {
      id: 25,
      name: "Spring Break Camp 2024",
      start_date: new Date("2024-03-01"),
      end_date: new Date("2024-03-10"),
      camp_type_code: campTypeHolidayCampDate as UnitDynamicCentral,
      franchise_id: null,  
      is_deleted: false,
    }
  ];
  await holidayCampDatesRepository.upsert(holidayCampDates as any, ["id"]);





  /****************************************
                SessionPlan
  *****************************************/
  const sessionPlanRepository = dataSource.getRepository(SessionPlan);
  const abilityGroupSessionPlan = await dataSource
                .getRepository(AbilityGroup)
                .findOneBy({ id: 421 });
  const sessionPlans: Partial<SessionPlan>[] = [
    {
        id: 256,
        title: "Basic Programming Skills",
        description: "Introduction to programming, covering the basics of syntax and logic.",
        ability_group_id: abilityGroupSessionPlan as AbilityGroup,  
        franchise_id: null,  
        is_deleted: false,
    },
    {
      id: 257,
      title: "Advanced Math Techniques",
      description: "A deep dive into advanced mathematical concepts and problem-solving techniques.",
      ability_group_id: abilityGroupSessionPlan as AbilityGroup, 
      franchise_id: franchise,  
      is_deleted: false,
    },
    {
      id: 258,
      title: "Creative Writing Workshop",
      description: "Explore creative writing techniques, storytelling, and character development.",
      ability_group_id: abilityGroupSessionPlan as AbilityGroup, 
      franchise_id: null,
      is_deleted: false,
    }
  ];
  await sessionPlanRepository.upsert(sessionPlans as any, ["id"]);





  /****************************************
              Subscription Plan
  *****************************************/
  const subscriptionPlanRepository = dataSource.getRepository(SubscriptionPlan);
  const serviceSubscriptionPlan = await dataSource
                                .getRepository(UnitDynamicCentral)
                                .findOneBy({ code: "CLUB" });

  const venueSubscriptionPlan = await dataSource
                                  .getRepository(Venue)
                                  .findOneBy({ id: 345 });

  const subscriptionPlans: Partial<SubscriptionPlan>[] = [
    {
        id: 411,
        service_code: serviceSubscriptionPlan as UnitDynamicCentral, 
        venue_id: venueSubscriptionPlan as Venue, 
        name: "Basic Subscription Plan",
        duration: 30,  
        franchise_id: franchise, 
        is_deleted: false,
    },
    {
      id:412,
      service_code: serviceSubscriptionPlan as UnitDynamicCentral, 
      venue_id: venueSubscriptionPlan as Venue, 
      name: "Premium Subscription Plan",
      duration: 60,  
      franchise_id: null,  
      is_deleted: false,
    },
    {
      id:413,
      service_code: serviceSubscriptionPlan as UnitDynamicCentral, 
      venue_id: venueSubscriptionPlan as Venue, 
      name: "Family Subscription Plan",
      duration: 90,  
      franchise_id: franchise,  
      is_deleted: false,
    }
  ];
  await subscriptionPlanRepository.upsert(subscriptionPlans as any, ["id"]);





  /****************************************
          Subscription Plan Price
  *****************************************/
  const subscriptionPlanPriceRepository = dataSource.getRepository(SubscriptionPlanPrice);
  const subscriptionPlan = await dataSource
                          .getRepository(SubscriptionPlan)
                          .findOneBy({ id: 411 });

  const paymentTypeSubscriptionPlanPrice = await dataSource
                          .getRepository(UnitDynamicCentral)
                          .findOneBy({ code: "ACCESS_PAYSUITE" });
  
  const studentCoverageSubscriptionPlanPrice = await dataSource
                          .getRepository(UnitDynamicCentral)
                          .findOneBy({ code: "TWO_STUDENTS" });

  const subscriptionPlanPrices: Partial<SubscriptionPlanPrice>[] = [
    {
        id: 751,
        name: "Basic Plan Price",
        monthly_subscription_fee: 20.00,
        price_per_class_per_child: 5.00,
        one_off_joining_fee: 10.00,
        subscription_plan_id: subscriptionPlan as SubscriptionPlan,  
        payment_type_code: paymentTypeSubscriptionPlanPrice as UnitDynamicCentral,  
        student_coverage_code: studentCoverageSubscriptionPlanPrice as UnitDynamicCentral,  
        franchise_id: franchise,  
        is_deleted: false,
    },
    {
      id: 752,
      name: "Premium Plan Price",
      monthly_subscription_fee: 35.00,
      price_per_class_per_child: 8.00,
      one_off_joining_fee: 15.00,
      subscription_plan_id: subscriptionPlan as SubscriptionPlan,  
      payment_type_code: paymentTypeSubscriptionPlanPrice as UnitDynamicCentral,  
      student_coverage_code: studentCoverageSubscriptionPlanPrice as UnitDynamicCentral,  
      franchise_id: null,  
      is_deleted: false,
    },
    {
      id: 753,
      name: "Family Plan Price",
      monthly_subscription_fee: 50.00,
      price_per_class_per_child: 10.00,
      one_off_joining_fee: 20.00,
      subscription_plan_id: subscriptionPlan as SubscriptionPlan,  
      payment_type_code: paymentTypeSubscriptionPlanPrice as UnitDynamicCentral,  
      student_coverage_code: studentCoverageSubscriptionPlanPrice as UnitDynamicCentral,   
      franchise_id: null,  
      is_deleted: false,
    }
  ];
  await subscriptionPlanPriceRepository.upsert(subscriptionPlanPrices as any, ["id"]);
        




  /****************************************
          Term
  *****************************************/
  const termRepository = dataSource.getRepository(Term);
  const seasonSummerTerm = await dataSource
          .getRepository(UnitDynamicCentral)
          .findOneBy({ code: "SUMMER" });

  const seasonSpringTerm = await dataSource
          .getRepository(UnitDynamicCentral)
          .findOneBy({ code: "SPRING" });

  const seasonAutumTerm = await dataSource
          .getRepository(UnitDynamicCentral)
          .findOneBy({ code: "AUTUMN" });

  const terms: Partial<Term>[] = [
    {
        id: 278,
        name: "Summer Term 2024",
        start_date: new Date('2024-07-01'),
        end_date: new Date('2024-09-30'),
        half_term_date: new Date('2024-08-15'),
        season_code: seasonSummerTerm as UnitDynamicCentral,  
        franchise_id: franchise,  
        is_deleted: false,
    },
    {
      id: 279,
      name: "Spring Term 2024",
      start_date: new Date('2024-03-01'),
      end_date: new Date('2024-06-30'),
      half_term_date: new Date('2024-04-15'),
      season_code: seasonSpringTerm as UnitDynamicCentral,  
      franchise_id: null,  
      is_deleted: false,
    },
    {
      id: 280,
      name: "Autumn Term 2024",
      start_date: new Date('2024-10-01'),
      end_date: new Date('2024-12-20'),
      half_term_date: new Date('2024-11-10'),
      season_code: seasonAutumTerm as UnitDynamicCentral,  
      franchise_id: franchise,  
      is_deleted: false,
    }
  ];
  await termRepository.upsert(terms as any, ["id"]);




  /****************************************
              Weekly Classes
  *****************************************/
    const weeklyClassRepository = dataSource.getRepository(WeeklyClass);
    const venueWeeklyClass = await venueRepository.findOneBy({ id: 345});
    const venueWeeklyClass2 = await venueRepository.findOneBy({ id: 347});
    const autumnTerm = await termRepository.findOneBy({ id: 280 });
    const springTerm = await termRepository.findOneBy({ id: 279 });
    const summerTerm = await termRepository.findOneBy({ id: 278 });
    
    const weeklyClasses: Partial<WeeklyClass>[] = [
      {
        id: 1,
        venue_id: venueWeeklyClass as Venue,
        name: "Monday Yoga Class",
        capacity: 20,
        days: "Monday",
        start_time: "08:00:00",
        end_time: "09:00:00",
        autumn_term_id: autumnTerm as Term,
        is_autumn_indoor: true,
        spring_term_id: springTerm as Term,
        is_spring_indoor: true,
        summer_term_id: summerTerm as Term,
        is_summer_indoor: false,
        is_free_trail_dates: true,
        free_trial_dates: [{ start: "2024-01-15", end: "2024-01-20" }],
        franchise_id: franchise,
        is_deleted: false,
      },
      {
        id: 2,
        venue_id: venueWeeklyClass as Venue,
        name: "Tuesday Dance Class",
        capacity: 25,
        days: "Tuesday",
        start_time: "10:00:00",
        end_time: "11:30:00",
        autumn_term_id: autumnTerm as Term,
        is_autumn_indoor: false,
        spring_term_id: springTerm as Term,
        is_spring_indoor: true,
        summer_term_id: summerTerm as Term,
        is_summer_indoor: true,
        is_free_trail_dates: false,
        free_trial_dates: null,
        franchise_id: null,
        is_deleted: false,
      },
      {
        id: 3,
        venue_id: venueWeeklyClass2 as Venue,
        name: "Wednesday Art Class",
        capacity: 15,
        days: "Wednesday",
        start_time: "14:00:00",
        end_time: "15:30:00",
        autumn_term_id: autumnTerm as Term,
        is_autumn_indoor: true,
        spring_term_id: springTerm as Term,
        is_spring_indoor: false,
        summer_term_id: summerTerm as Term,
        is_summer_indoor: true,
        is_free_trail_dates: true,
        free_trial_dates: [{ start: "2024-02-10", end: "2024-02-15" }],
        franchise_id: franchise,
        is_deleted: false,
      },
    ];
    
    await weeklyClassRepository.upsert(weeklyClasses as any, ["id"]);





    /****************************************
              Family
    *****************************************/
    const familyRepository = dataSource.getRepository(Family);
    const families: Partial<Family>[] = [
      {
        id: 1,
        loyalty_points: 500,
        franchise_id: franchise as Franchise,
        is_deleted: false,
      },
      {
        id: 2,
        loyalty_points: 200,
        franchise_id: null, 
        is_deleted: false,
      },
      {
        id: 3,
        loyalty_points: 350,
        franchise_id: franchise as Franchise, 
        is_deleted: false,
      },
    ];

    await familyRepository.upsert(families as any, ["id"]);




     
    /****************************************
              Student
    *****************************************/
    const studentRepository = dataSource.getRepository(Student);

    const familyOne = await dataSource.getRepository(Family).findOneBy({ id: 1 });
    const familyTwo = await dataSource.getRepository(Family).findOneBy({ id: 2 });
    
    const students: Partial<Student>[] = [
      {
        id: 57,
        first_name: "John",
        last_name: "Doe",
        dob: new Date("2000-05-15"),
        age: 17,
        medical_information: "No known conditions",
        gender: "Male",
        family_id: familyOne as Family, 
        franchise_id: franchise as Franchise, 
        is_deleted: false,
      },
      {
        id: 58,
        first_name: "Jane",
        last_name: "Smith",
        dob: new Date("1998-11-30"),
        age: 26,
        medical_information: null, 
        gender: "Female",
        family_id: familyTwo as Family, 
        franchise_id: null, 
        is_deleted: false,
      },
      {
        id: 59,
        first_name: "Emily",
        last_name: "Johnson",
        dob: new Date("2002-02-10"),
        age: 14,
        medical_information: "Asthma",
        gender: "Female",
        family_id: null, 
        franchise_id: franchise as Franchise, 
        is_deleted: false,
      },
    ];
    
    await studentRepository.upsert(students as any, ["id"]);





    /****************************************
            Weekly Classes Member
    *****************************************/
    const weeklyClassMemberRepository = dataSource.getRepository(WeeklyClassMember);

    const weeklyClassOne = await dataSource.getRepository(WeeklyClass).findOneBy({ id: 1 });
    const weeklyClassTwo = await dataSource.getRepository(WeeklyClass).findOneBy({ id: 2 });
    const subscriptionPlanPrice1 = await dataSource.getRepository(SubscriptionPlanPrice).findOneBy({ id: 752 });
    const subscriptionPlanPrice2 = await dataSource.getRepository(SubscriptionPlanPrice).findOneBy({ id: 753 });
    const memberStatus1 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "ACTIVE_MS" });
    const memberStatus2 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "PAY_PENDING_MS" });
    const student1 = await dataSource.getRepository(Student).findOneBy({ id: 57 });
    const student2 = await dataSource.getRepository(Student).findOneBy({ id: 58 });

    const weeklyClassMembers: Partial<WeeklyClassMember>[] = [
      {
        id: 1,
        weekly_class_id: weeklyClassOne as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice1 as SubscriptionPlanPrice,
        member_status_code: memberStatus1 as UnitDynamicCentral,
        student_id: student1 as Student,
        agent_id: null,
        booked_by: null,
        start_date: new Date("2024-11-01"),
        franchise_id: franchise as Franchise,
        is_deleted: false,
        created_date: new Date(),
        updated_date: null,
      },
      {
        id: 2,
        weekly_class_id: weeklyClassOne as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice2 as SubscriptionPlanPrice,
        member_status_code: memberStatus2 as UnitDynamicCentral,
        student_id: student2 as Student,
        agent_id: null,
        booked_by: null,
        start_date: new Date("2024-11-02"),
        franchise_id: franchise as Franchise,
        is_deleted: false,
        created_date: new Date(),
        updated_date: null,
      },
      {
        id: 3,
        weekly_class_id: weeklyClassOne as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice2 as SubscriptionPlanPrice,
        member_status_code: memberStatus1 as UnitDynamicCentral,
        student_id: student1 as Student,
        agent_id: null,
        booked_by: null,
        start_date: new Date("2024-11-03"),
        franchise_id: null,
        is_deleted: false,
        created_date: new Date(),
        updated_date: null,
      },
    ];

    await weeklyClassMemberRepository.upsert(weeklyClassMembers as any, ["id"]);





    /****************************************
                    Guardian
    *****************************************/
    const guardianRepository = dataSource.getRepository(Guardian);
    const relationshipCode1 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "GRANDPARENT" });
    const relationshipCode2 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "GUARDIAN" });
    const referralSourceCode = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "INSTAGRAM" })

    const guardians: Partial<Guardian>[] = [
      {
        id: 123,
        other_relationship: null,
        relationship_code: relationshipCode1 as UnitDynamicCentral,
        referral_source_code: referralSourceCode as UnitDynamicCentral,
        family_id: familyOne as Family,
        franchise_id: franchise as Franchise,
        is_deleted: false,
      },
      {
        id: 124,
        other_relationship: "Uncle",
        relationship_code: relationshipCode2 as UnitDynamicCentral,
        referral_source_code: null,
        family_id: familyTwo as Family,
        franchise_id: null,
        is_deleted: false,
      },
      {
        id: 125,
        other_relationship: null,
        relationship_code: null,
        referral_source_code: referralSourceCode as UnitDynamicCentral,
        family_id: null,
        franchise_id: franchise as Franchise,
        is_deleted: false,
      },
    ];

    await guardianRepository.upsert(guardians as any, ["id"]);







    /****************************************
                Weekly Class Sale
    *****************************************/
    const weeklyClassMemberOne = await dataSource.getRepository(WeeklyClassMember).findOneBy({ id: 123 });
    const weeklyClassMemberTwo = await dataSource.getRepository(WeeklyClassMember).findOneBy({ id: 125 });
    const saleStatusCode1 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "ACTIVE_SS" })
    const saleStatusCode2 = await dataSource.getRepository(UnitDynamicCentral).findOneBy({ code: "INACTIVE_SS" })

    const weeklyClassSaleRepository = dataSource.getRepository(WeeklyClassSale);
    const weeklyClassSales: Partial<WeeklyClassSale>[] = [
      {
        id: 256,
        start_date: '2024-06-18',
        weekly_class_member_id: weeklyClassMemberOne as WeeklyClassMember,
        weekly_class_id: weeklyClassOne as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice1 as SubscriptionPlanPrice,
        sale_status_code: saleStatusCode2 as UnitDynamicCentral,
        student_id: student1 as Student,
        agent_id: null,
        booked_by: null,
        franchise_id: franchise as Franchise,
        is_deleted: false,
      },
      {
        id: 257,
        start_date: '2024-05-19',
        weekly_class_member_id: weeklyClassMemberOne as WeeklyClassMember,
        weekly_class_id: weeklyClassTwo as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice2 as SubscriptionPlanPrice,
        sale_status_code: saleStatusCode1 as UnitDynamicCentral,
        student_id: student2 as Student,
        agent_id: null,
        booked_by: null,
        franchise_id: franchise as Franchise,
        is_deleted: false,
      },
      {
        id: 258,
        start_date: '2024-10-20',
        weekly_class_member_id: weeklyClassMemberTwo as WeeklyClassMember,
        weekly_class_id: weeklyClassTwo as WeeklyClass,
        subscription_plan_price_id: subscriptionPlanPrice2 as SubscriptionPlanPrice,
        sale_status_code: saleStatusCode1 as UnitDynamicCentral,
        student_id: student1 as Student,
        agent_id: null,
        booked_by: null,
        franchise_id: null,
        is_deleted: false,
      },
    ];

    await weeklyClassSaleRepository.upsert(weeklyClassSales as any, ["id"]);



  console.log("STG seed done!");
}

runSeed().catch((error) => console.error(error));