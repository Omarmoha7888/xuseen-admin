import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {
  User,
  Customer,
  Order,
  Payment,
  Transaction,
  Conversation,
  Message,
  DocumentFile,
  NotificationItem,
  ActivityLog,
  FinancialAdjustment,
} from '../types';

export interface CRMDatabase {
  users: (User & { password_hash: string })[];
  customers: Customer[];
  orders: Order[];
  payments: Payment[];
  transactions: Transaction[];
  financial_adjustments: FinancialAdjustment[];
  conversations: Conversation[];
  messages: Message[];
  documents: DocumentFile[];
  notifications: NotificationItem[];
  activity_logs: ActivityLog[];
}

// Initial demo database builder
export function createSeedData(): CRMDatabase {
  const adminPasswordHash = bcrypt.hashSync('xuseen.50', 10);
  const staffPasswordHash = bcrypt.hashSync('password123', 10);

  const users: (User & { password_hash: string })[] = [
    {
      id: 'usr-admin-01',
      username: 'blc00001',
      role: 'super_admin',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-01T08:00:00Z',
      last_login: new Date().toISOString(),
      password_hash: adminPasswordHash,
      profile: {
        id: 'prof-01',
        user_id: 'usr-admin-01',
        full_name: 'Hussein Mohamud Ali',
        phone: '612483838',
        email: 'balcadtravel@gmail.com',
        department: 'Executive Management',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
    },
    {
      id: 'usr-staff-01',
      username: 'mohamed',
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-10T09:30:00Z',
      last_login: new Date(Date.now() - 3600000).toISOString(),
      password_hash: staffPasswordHash,
      profile: {
        id: 'prof-02',
        user_id: 'usr-staff-01',
        full_name: 'Mohamed Abdullahi',
        phone: '612141414',
        email: 'mohamed.abdullahi@balcadtravel.so',
        department: 'Ticketing & Flights',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    },
    {
      id: 'usr-staff-02',
      username: 'sarah',
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-15T11:00:00Z',
      last_login: new Date(Date.now() - 7200000).toISOString(),
      password_hash: staffPasswordHash,
      profile: {
        id: 'prof-03',
        user_id: 'usr-staff-02',
        full_name: 'Sarah Warsame',
        phone: '612998877',
        email: 'sarah.warsame@balcadtravel.so',
        department: 'Visa Operations',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
    },
    {
      id: 'usr-staff-03',
      username: 'ali',
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-02-01T10:15:00Z',
      last_login: new Date(Date.now() - 86400000).toISOString(),
      password_hash: staffPasswordHash,
      profile: {
        id: 'prof-04',
        user_id: 'usr-staff-03',
        full_name: 'Ali Guled',
        phone: '612554433',
        email: 'ali.guled@balcadtravel.so',
        department: 'Customer Support & Transfers',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
    },
  ];

  const customers: Customer[] = [
    {
      id: 'cust-01',
      full_name: 'Ahmed Hassan Farah',
      phone: '615112233',
      email: 'ahmed.hassan@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Frequent VIP business traveler',
      created_at: '2026-02-10T10:00:00Z',
      orders_count: 2,
      total_debt: 0,
      last_order_date: '2026-04-26',
    },
    {
      id: 'cust-02',
      full_name: 'Fatima Ali Nur',
      phone: '615223344',
      email: 'fatima.ali@yahoo.com',
      country: 'Somalia',
      city: 'Hargeisa',
      notes: 'Family visa requests',
      created_at: '2026-02-14T11:00:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-26',
    },
    {
      id: 'cust-03',
      full_name: 'Mohamed Yusuf Shire',
      phone: '615334455',
      email: 'yusuf.shire@outlook.com',
      country: 'Somalia',
      city: 'Garowe',
      notes: 'Requests 5-star hotels only',
      created_at: '2026-02-18T14:00:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-25',
    },
    {
      id: 'cust-04',
      full_name: 'Amina Sheikh Omar',
      phone: '615445566',
      email: 'amina.sheikh@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Dubai group vacationer. Has agreed payment schedule.',
      created_at: '2026-02-22T09:00:00Z',
      orders_count: 1,
      total_debt: 1300,
      last_order_date: '2026-04-24',
    },
    {
      id: 'cust-05',
      full_name: 'Ali Ahmed Jama',
      phone: '615556677',
      email: 'ali.ahmed.j@gmail.com',
      country: 'Somalia',
      city: 'Kismayo',
      notes: 'Regular economy ticketing',
      created_at: '2026-03-01T15:30:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-24',
    },
    {
      id: 'cust-06',
      full_name: 'Sahra Osman Duale',
      phone: '615667788',
      email: 'sahra.osman@hotmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Visa processing debt order pending payment',
      created_at: '2026-03-05T08:45:00Z',
      orders_count: 1,
      total_debt: 450,
      last_order_date: '2026-04-22',
    },
    {
      id: 'cust-07',
      full_name: 'Hassan Nur Roble',
      phone: '615778899',
      email: 'hassan.roble@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'VIP transfer client',
      created_at: '2026-03-10T12:00:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-21',
    },
    {
      id: 'cust-08',
      full_name: 'Maryan Abdi Warsame',
      phone: '615889900',
      email: 'maryan.abdi@gmail.com',
      country: 'Somalia',
      city: 'Baidoa',
      notes: 'Nairobi medical travel',
      created_at: '2026-03-12T16:20:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-20',
    },
    {
      id: 'cust-09',
      full_name: 'Liban Jama Warsame',
      phone: '615990011',
      email: 'liban.jama@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Safari holiday package with installment agreement',
      created_at: '2026-03-15T11:10:00Z',
      orders_count: 1,
      total_debt: 1100,
      last_order_date: '2026-04-18',
    },
    {
      id: 'cust-10',
      full_name: 'Deqa Farah Egal',
      phone: '615001122',
      email: 'deqa.farah@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Luxury Dubai hotel reservation',
      created_at: '2026-03-20T14:40:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-04-16',
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-01',
      order_number: 'BAL-2026-00001',
      customer_id: 'cust-01',
      service_type: 'Flight Ticket',
      status: 'Confirmed',
      payment_type: 'Paid',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 1200,
      amount_paid: 1200,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        departure_city: 'Mogadishu (MGQ)',
        destination: 'Istanbul (IST)',
        departure_date: '2026-05-10',
        return_date: '2026-05-25',
        trip_type: 'round_trip',
        adults: 1,
        children: 0,
        infants: 0,
        preferred_airline: 'Turkish Airlines',
        cabin_class: 'Business',
        passenger_names: ['Ahmed Hassan Farah'],
        passport_numbers: ['P0876543'],
      },
      notes: 'VIP customer requested window seat and halal special meal.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-04-26T09:00:00Z',
      created_at: '2026-04-26T09:00:00Z',
      updated_at: '2026-04-26T09:30:00Z',
    },
    {
      id: 'ord-02',
      order_number: 'BAL-2026-00002',
      customer_id: 'cust-02',
      service_type: 'Visa Service',
      status: 'Pending',
      payment_type: 'Paid',
      created_by: 'mohamed',
      created_by_user_id: 'usr-staff-01',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 850,
      amount_paid: 850,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination_country: 'Turkey',
        visa_type: 'Tourist Multi-entry',
        applicant_nationality: 'Somali',
        passport_status: 'Valid > 6 months',
        intended_travel_date: '2026-06-01',
        applicants_count: 2,
        required_documents: ['Passport copy', 'Bank statement', 'Photo with white background'],
      },
      notes: 'Documents submitted to embassy queue.',
      price_entered_by: 'mohamed',
      price_entered_at: '2026-04-26T10:15:00Z',
      created_at: '2026-04-26T10:15:00Z',
      updated_at: '2026-04-26T10:15:00Z',
    },
    {
      id: 'ord-03',
      order_number: 'BAL-2026-00003',
      customer_id: 'cust-03',
      service_type: 'Hotel',
      status: 'In Progress',
      payment_type: 'Paid',
      created_by: 'sarah',
      created_by_user_id: 'usr-staff-02',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 650,
      amount_paid: 650,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination: 'Istanbul, Turkey',
        hotel_preference: 'Hilton Bosphorus Istanbul',
        check_in_date: '2026-05-11',
        check_out_date: '2026-05-16',
        rooms_count: 1,
        guests_count: 2,
        room_type: 'Deluxe Bosphorus Sea View',
        special_requirements: 'Late check-in requested.',
      },
      notes: 'Waiting for hotel voucher confirmation code.',
      price_entered_by: 'sarah',
      price_entered_at: '2026-04-25T14:20:00Z',
      created_at: '2026-04-25T14:20:00Z',
      updated_at: '2026-04-25T15:00:00Z',
    },
    {
      id: 'ord-04',
      order_number: 'BAL-2026-00004',
      customer_id: 'cust-04',
      service_type: 'Travel Package',
      status: 'Debt',
      payment_type: 'Debt',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 2300,
      amount_paid: 1000,
      outstanding_debt: 1300,
      currency: 'USD',
      service_details: {
        destination: 'Dubai, UAE',
        travel_dates: '2026-05-15 to 2026-05-22',
        travelers_count: 3,
        accommodation_requirements: '4-star hotel in Downtown Dubai',
        transport_requirements: 'Private SUV Airport & Safari Transfer',
        activities: 'Desert Safari, Burj Khalifa At the Top, Dubai Marina Cruise',
      },
      notes: 'Down payment of $1,000 received. Balance $1,300 scheduled on 10th May.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-04-24T11:00:00Z',
      created_at: '2026-04-24T11:00:00Z',
      updated_at: '2026-04-24T11:45:00Z',
    },
    {
      id: 'ord-05',
      order_number: 'BAL-2026-00005',
      customer_id: 'cust-05',
      service_type: 'Flight Ticket',
      status: 'Completed',
      payment_type: 'Paid',
      created_by: 'mohamed',
      created_by_user_id: 'usr-staff-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 980,
      amount_paid: 980,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        departure_city: 'Hargeisa (HGA)',
        destination: 'Dubai (DXB)',
        departure_date: '2026-04-28',
        return_date: '2026-05-08',
        trip_type: 'round_trip',
        adults: 1,
        children: 0,
        infants: 0,
        preferred_airline: 'flydubai',
        cabin_class: 'Economy',
        passenger_names: ['Ali Ahmed Jama'],
      },
      notes: 'Ticket issued and e-ticket emailed to client.',
      price_entered_by: 'mohamed',
      price_entered_at: '2026-04-24T13:00:00Z',
      created_at: '2026-04-24T13:00:00Z',
      updated_at: '2026-04-24T14:10:00Z',
    },
    {
      id: 'ord-06',
      order_number: 'BAL-2026-00006',
      customer_id: 'cust-06',
      service_type: 'Visa Service',
      status: 'Debt',
      payment_type: 'Debt',
      created_by: 'sarah',
      created_by_user_id: 'usr-staff-02',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 450,
      amount_paid: 0,
      outstanding_debt: 450,
      currency: 'USD',
      service_details: {
        destination_country: 'United Arab Emirates',
        visa_type: '60 Days Tourist Visa',
        applicant_nationality: 'Somali',
        passport_status: 'Valid until 2029',
        intended_travel_date: '2026-05-20',
        applicants_count: 1,
        required_documents: ['Passport Bio page', 'White background photo'],
      },
      notes: 'Zero payment so far. Fully unpaid debt order.',
      price_entered_by: 'sarah',
      price_entered_at: '2026-04-22T09:30:00Z',
      created_at: '2026-04-22T09:30:00Z',
      updated_at: '2026-04-22T09:30:00Z',
    },
    {
      id: 'ord-07',
      order_number: 'BAL-2026-00007',
      customer_id: 'cust-07',
      service_type: 'Airport Transfer',
      status: 'Confirmed',
      payment_type: 'Paid',
      created_by: 'ali',
      created_by_user_id: 'usr-staff-03',
      assigned_staff: 'ali',
      assigned_staff_id: 'usr-staff-03',
      total_price: 120,
      amount_paid: 120,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        pickup_location: 'Istanbul International Airport (IST)',
        destination: 'Taksim Square Hotel',
        transfer_datetime: '2026-05-10 18:00',
        passengers_count: 3,
        vehicle_type: 'Mercedes Vito VIP',
        flight_number: 'TK687',
      },
      notes: 'Driver will hold Balcad Travel nameboard at gate 14.',
      price_entered_by: 'ali',
      price_entered_at: '2026-04-21T15:00:00Z',
      created_at: '2026-04-21T15:00:00Z',
      updated_at: '2026-04-21T16:00:00Z',
    },
    {
      id: 'ord-08',
      order_number: 'BAL-2026-00008',
      customer_id: 'cust-08',
      service_type: 'Flight Ticket',
      status: 'Available',
      payment_type: 'Paid',
      created_by: 'mohamed',
      created_by_user_id: 'usr-staff-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 550,
      amount_paid: 550,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        departure_city: 'Mogadishu (MGQ)',
        destination: 'Nairobi (NBO)',
        departure_date: '2026-05-02',
        trip_type: 'one_way',
        adults: 1,
        children: 0,
        infants: 0,
        preferred_airline: 'Kenya Airways',
        cabin_class: 'Economy',
        passenger_names: ['Maryan Abdi Warsame'],
      },
      notes: 'Seats held in GDS awaiting client confirmation of time.',
      price_entered_by: 'mohamed',
      price_entered_at: '2026-04-20T11:20:00Z',
      created_at: '2026-04-20T11:20:00Z',
      updated_at: '2026-04-20T11:20:00Z',
    },
    {
      id: 'ord-09',
      order_number: 'BAL-2026-00009',
      customer_id: 'cust-09',
      service_type: 'Travel Package',
      status: 'Debt',
      payment_type: 'Debt',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'ali',
      assigned_staff_id: 'usr-staff-03',
      total_price: 1800,
      amount_paid: 700,
      outstanding_debt: 1100,
      currency: 'USD',
      service_details: {
        destination: 'Kenya - Masai Mara',
        travel_dates: '2026-06-10 to 2026-06-15',
        travelers_count: 2,
        accommodation_requirements: 'Luxury Tented Camp with full board',
        transport_requirements: '4x4 Land Cruiser with pop-up roof',
        activities: 'Game drives, Hot air balloon safari',
      },
      notes: 'Paid $700 initial deposit. Outstanding debt $1,100.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-04-18T10:00:00Z',
      created_at: '2026-04-18T10:00:00Z',
      updated_at: '2026-04-18T10:30:00Z',
    },
    {
      id: 'ord-10',
      order_number: 'BAL-2026-00010',
      customer_id: 'cust-10',
      service_type: 'Hotel',
      status: 'Waiting for Documents',
      payment_type: 'Paid',
      created_by: 'sarah',
      created_by_user_id: 'usr-staff-02',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 950,
      amount_paid: 950,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination: 'Dubai, UAE',
        hotel_preference: 'Fairmont The Palm',
        check_in_date: '2026-05-18',
        check_out_date: '2026-05-23',
        rooms_count: 1,
        guests_count: 2,
        room_type: 'Palm View Suite',
      },
      notes: 'Awaiting passport scans for hotel guest registration.',
      price_entered_by: 'sarah',
      price_entered_at: '2026-04-16T12:00:00Z',
      created_at: '2026-04-16T12:00:00Z',
      updated_at: '2026-04-16T12:00:00Z',
    },
    {
      id: 'ord-11',
      order_number: 'BAL-2026-00011',
      customer_id: 'cust-01',
      service_type: 'Flight Ticket',
      status: 'New',
      payment_type: 'Paid',
      created_by: 'mohamed',
      created_by_user_id: 'usr-staff-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 620,
      amount_paid: 620,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        departure_city: 'Mogadishu (MGQ)',
        destination: 'Cairo (CAI)',
        departure_date: '2026-06-05',
        trip_type: 'one_way',
        adults: 1,
        children: 0,
        infants: 0,
        preferred_airline: 'EgyptAir',
        cabin_class: 'Economy',
        passenger_names: ['Ahmed Hassan Farah'],
      },
      notes: 'New inquiry directly from customer.',
      price_entered_by: 'mohamed',
      price_entered_at: '2026-04-26T14:00:00Z',
      created_at: '2026-04-26T14:00:00Z',
      updated_at: '2026-04-26T14:00:00Z',
    },
    {
      id: 'ord-12',
      order_number: 'BAL-2026-00012',
      customer_id: 'cust-02',
      service_type: 'Visa Service',
      status: 'Rejected',
      payment_type: 'Paid',
      created_by: 'sarah',
      created_by_user_id: 'usr-staff-02',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 350,
      amount_paid: 350,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination_country: 'Egypt',
        visa_type: 'Business Visa',
        applicant_nationality: 'Somali',
        passport_status: 'Valid',
        intended_travel_date: '2026-05-01',
        applicants_count: 1,
        required_documents: ['Company invitation'],
      },
      notes: 'Embassy rejected due to incomplete invitation letter verification.',
      price_entered_by: 'sarah',
      price_entered_at: '2026-04-12T09:00:00Z',
      created_at: '2026-04-12T09:00:00Z',
      updated_at: '2026-04-14T11:00:00Z',
    },
    {
      id: 'ord-13',
      order_number: 'BAL-2026-00013',
      customer_id: 'cust-05',
      service_type: 'Flight Ticket',
      status: 'Completed',
      payment_type: 'Debt',
      created_by: 'mohamed',
      created_by_user_id: 'usr-staff-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 1400,
      amount_paid: 1400,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        departure_city: 'Mogadishu (MGQ)',
        destination: 'London Heathrow (LHR)',
        departure_date: '2026-04-15',
        return_date: '2026-05-15',
        trip_type: 'round_trip',
        adults: 1,
        children: 0,
        infants: 0,
        preferred_airline: 'Qatar Airways',
        cabin_class: 'Economy',
        passenger_names: ['Ali Ahmed Jama'],
      },
      notes: 'Originally booked on debt. Final payment completed. Marked Paid and Completed.',
      price_entered_by: 'mohamed',
      price_entered_at: '2026-04-05T10:00:00Z',
      created_at: '2026-04-05T10:00:00Z',
      updated_at: '2026-04-15T16:30:00Z',
    },
    {
      id: 'ord-14',
      order_number: 'BAL-2026-00014',
      customer_id: 'cust-04',
      service_type: 'Travel Package',
      status: 'Confirmed',
      payment_type: 'Paid',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 2600,
      amount_paid: 2600,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination: 'Makkah & Madinah',
        travel_dates: '2026-05-28 to 2026-06-12',
        travelers_count: 2,
        accommodation_requirements: '5-star Clock Tower Hotel Makkah',
        transport_requirements: 'Haramain High Speed Train & VIP Bus',
        activities: 'Umrah Package & Ziyarat in Madinah',
      },
      notes: 'Full payment received in advance via bank wire.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-04-20T10:00:00Z',
      created_at: '2026-04-20T10:00:00Z',
      updated_at: '2026-04-21T11:00:00Z',
    },
    {
      id: 'ord-15',
      order_number: 'BAL-2026-00015',
      customer_id: 'cust-07',
      service_type: 'Airport Transfer',
      status: 'Completed',
      payment_type: 'Paid',
      created_by: 'ali',
      created_by_user_id: 'usr-staff-03',
      assigned_staff: 'ali',
      assigned_staff_id: 'usr-staff-03',
      total_price: 80,
      amount_paid: 80,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        pickup_location: 'Aden Adde International Airport Mogadishu (MGQ)',
        destination: 'Jazeera Palace Hotel',
        transfer_datetime: '2026-04-23 11:30',
        passengers_count: 2,
        vehicle_type: 'Toyota Land Cruiser Prado',
      },
      notes: 'Transfer executed smoothly.',
      price_entered_by: 'ali',
      price_entered_at: '2026-04-22T14:00:00Z',
      created_at: '2026-04-22T14:00:00Z',
      updated_at: '2026-04-23T12:00:00Z',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'PAY-1001',
      order_id: 'ord-01',
      amount: 1200,
      currency: 'USD',
      payment_method: 'Bank Transfer',
      payment_note: 'Premier Bank transfer #PB884930',
      received_by: 'blc00001',
      payment_date: '2026-04-26',
      created_at: '2026-04-26T09:15:00Z',
    },
    {
      id: 'PAY-1002',
      order_id: 'ord-02',
      amount: 850,
      currency: 'USD',
      payment_method: 'EVC Plus',
      payment_note: 'EVC Plus reference #77382940',
      received_by: 'mohamed',
      payment_date: '2026-04-26',
      created_at: '2026-04-26T10:20:00Z',
    },
    {
      id: 'PAY-1003',
      order_id: 'ord-04',
      amount: 1000,
      currency: 'USD',
      payment_method: 'Cash',
      payment_note: 'Initial partial deposit at main counter',
      received_by: 'blc00001',
      payment_date: '2026-04-24',
      created_at: '2026-04-24T11:15:00Z',
    },
    {
      id: 'PAY-1004',
      order_id: 'ord-09',
      amount: 700,
      currency: 'USD',
      payment_method: 'Zaad',
      payment_note: 'Deposit installment via Zaad service',
      received_by: 'ali',
      payment_date: '2026-04-18',
      created_at: '2026-04-18T10:15:00Z',
    },
    {
      id: 'PAY-1005',
      order_id: 'ord-13',
      amount: 700,
      currency: 'USD',
      payment_method: 'Cash',
      payment_note: 'First installment on debt',
      received_by: 'mohamed',
      payment_date: '2026-04-05',
      created_at: '2026-04-05T10:30:00Z',
    },
    {
      id: 'PAY-1006',
      order_id: 'ord-13',
      amount: 700,
      currency: 'USD',
      payment_method: 'Bank Transfer',
      payment_note: 'Final settlement payment, zero balance reached',
      received_by: 'mohamed',
      payment_date: '2026-04-15',
      created_at: '2026-04-15T16:00:00Z',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TRX-1001',
      order_id: 'BAL-2026-00001',
      customer_name: 'Ahmed Hassan Farah',
      payment_id: 'PAY-1001',
      transaction_type: 'Payment Received',
      previous_balance: 1200,
      payment_amount: 1200,
      new_balance: 0,
      total_paid_before: 0,
      total_paid_after: 1200,
      currency: 'USD',
      changed_by: 'blc00001',
      created_at: '2026-04-26T09:15:00Z',
      notes: 'Full payment received via Bank Transfer',
    },
    {
      id: 'TRX-1002',
      order_id: 'BAL-2026-00002',
      customer_name: 'Fatima Ali Nur',
      payment_id: 'PAY-1002',
      transaction_type: 'Payment Received',
      previous_balance: 850,
      payment_amount: 850,
      new_balance: 0,
      total_paid_before: 0,
      total_paid_after: 850,
      currency: 'USD',
      changed_by: 'mohamed',
      created_at: '2026-04-26T10:20:00Z',
      notes: 'Full payment received via EVC Plus',
    },
    {
      id: 'TRX-1003',
      order_id: 'BAL-2026-00004',
      customer_name: 'Amina Sheikh Omar',
      payment_id: 'PAY-1003',
      transaction_type: 'Partial Payment',
      previous_balance: 2300,
      payment_amount: 1000,
      new_balance: 1300,
      total_paid_before: 0,
      total_paid_after: 1000,
      currency: 'USD',
      changed_by: 'blc00001',
      created_at: '2026-04-24T11:15:00Z',
      notes: 'Partial payment received, debt updated to $1,300',
    },
    {
      id: 'TRX-1004',
      order_id: 'BAL-2026-00006',
      customer_name: 'Sahra Osman Duale',
      transaction_type: 'Order Created',
      previous_balance: 0,
      payment_amount: 0,
      new_balance: 450,
      total_paid_before: 0,
      total_paid_after: 0,
      currency: 'USD',
      changed_by: 'sarah',
      created_at: '2026-04-22T09:30:00Z',
      notes: 'Debt order initiated without initial payment',
    },
    {
      id: 'TRX-1005',
      order_id: 'BAL-2026-00009',
      customer_name: 'Liban Jama Warsame',
      payment_id: 'PAY-1004',
      transaction_type: 'Partial Payment',
      previous_balance: 1800,
      payment_amount: 700,
      new_balance: 1100,
      total_paid_before: 0,
      total_paid_after: 700,
      currency: 'USD',
      changed_by: 'ali',
      created_at: '2026-04-18T10:15:00Z',
      notes: 'Deposit installment recorded',
    },
    {
      id: 'TRX-1006',
      order_id: 'BAL-2026-00013',
      customer_name: 'Ali Ahmed Jama',
      payment_id: 'PAY-1006',
      transaction_type: 'Debt Fully Paid',
      previous_balance: 700,
      payment_amount: 700,
      new_balance: 0,
      total_paid_before: 700,
      total_paid_after: 1400,
      currency: 'USD',
      changed_by: 'mohamed',
      created_at: '2026-04-15T16:00:00Z',
      notes: 'Final debt installment completed. Outstanding balance is $0.',
    },
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv-01',
      type: 'direct',
      status: 'open',
      created_by: 'usr-admin-01',
      created_by_username: 'blc00001',
      created_at: '2026-04-25T10:00:00Z',
      updated_at: '2026-04-26T11:00:00Z',
      participants: [
        {
          id: 'cp-01',
          conversation_id: 'conv-01',
          user_id: 'usr-admin-01',
          username: 'blc00001',
          full_name: 'Hussein Mohamud Ali',
          phone: '612483838',
          joined_at: '2026-04-25T10:00:00Z',
          participant_status: 'active',
        },
        {
          id: 'cp-02',
          conversation_id: 'conv-01',
          user_id: 'usr-staff-01',
          username: 'mohamed',
          full_name: 'Mohamed Abdullahi',
          phone: '612141414',
          joined_at: '2026-04-25T10:00:00Z',
          participant_status: 'active',
        },
      ],
      unread_count: 1,
    },
    {
      id: 'conv-02',
      type: 'group',
      title: 'Operations & Emergency Ticketing',
      status: 'open',
      created_by: 'usr-admin-01',
      created_by_username: 'blc00001',
      created_at: '2026-04-24T08:30:00Z',
      updated_at: '2026-04-26T09:45:00Z',
      participants: [
        {
          id: 'cp-03',
          conversation_id: 'conv-02',
          user_id: 'usr-admin-01',
          username: 'blc00001',
          full_name: 'Hussein Mohamud Ali',
          phone: '612483838',
          joined_at: '2026-04-24T08:30:00Z',
          participant_status: 'active',
        },
        {
          id: 'cp-04',
          conversation_id: 'conv-02',
          user_id: 'usr-staff-01',
          username: 'mohamed',
          full_name: 'Mohamed Abdullahi',
          phone: '612141414',
          joined_at: '2026-04-24T08:30:00Z',
          participant_status: 'active',
        },
        {
          id: 'cp-05',
          conversation_id: 'conv-02',
          user_id: 'usr-staff-02',
          username: 'sarah',
          full_name: 'Sarah Warsame',
          phone: '612998877',
          joined_at: '2026-04-24T08:30:00Z',
          participant_status: 'active',
        },
      ],
      unread_count: 2,
    },
  ];

  const messages: Message[] = [
    {
      id: 'msg-01',
      conversation_id: 'conv-01',
      sender_id: 'usr-admin-01',
      sender_username: 'blc00001',
      sender_name: 'Hussein Mohamud Ali',
      message_text: 'Mohamed, please expedite the issuance of ticket for Ahmed Hassan BAL-2026-00001.',
      created_at: '2026-04-25T10:05:00Z',
    },
    {
      id: 'msg-02',
      conversation_id: 'conv-01',
      sender_id: 'usr-staff-01',
      sender_username: 'mohamed',
      sender_name: 'Mohamed Abdullahi',
      message_text: 'Confirmed. Ticket has been issued and attached here with Turkish Airlines PNR.',
      created_at: '2026-04-25T10:20:00Z',
      attachments: [
        {
          id: 'att-01',
          message_id: 'msg-02',
          conversation_id: 'conv-01',
          file_name: 'TurkishAirlines_ETicket_BAL-2026-00001.pdf',
          file_type: 'application/pdf',
          file_size: 245000,
          file_url: '/docs/sample_ticket.pdf',
          uploaded_at: '2026-04-25T10:20:00Z',
        },
      ],
    },
    {
      id: 'msg-03',
      conversation_id: 'conv-02',
      sender_id: 'usr-admin-01',
      sender_username: 'blc00001',
      sender_name: 'Hussein Mohamud Ali',
      message_text: 'Team, please review the upcoming Umrah groups and verify visa submission status for all applicants.',
      created_at: '2026-04-26T09:40:00Z',
    },
    {
      id: 'msg-04',
      conversation_id: 'conv-02',
      sender_id: 'usr-staff-02',
      sender_username: 'sarah',
      sender_name: 'Sarah Warsame',
      message_text: 'On it! All passport files and insurance certificates are uploaded in the documents tab.',
      created_at: '2026-04-26T09:45:00Z',
    },
  ];

  const documents: DocumentFile[] = [
    {
      id: 'doc-01',
      order_id: 'ord-01',
      customer_id: 'cust-01',
      file_name: 'Passport_Ahmed_Hassan.pdf',
      file_type: 'application/pdf',
      file_size: 1048576,
      file_url: '/docs/passport_sample.pdf',
      uploaded_by: 'blc00001',
      uploaded_at: '2026-04-26T09:05:00Z',
    },
    {
      id: 'doc-02',
      order_id: 'ord-02',
      customer_id: 'cust-02',
      file_name: 'Bank_Statement_Fatima_Ali.pdf',
      file_type: 'application/pdf',
      file_size: 524288,
      file_url: '/docs/bank_statement.pdf',
      uploaded_by: 'mohamed',
      uploaded_at: '2026-04-26T10:18:00Z',
    },
    {
      id: 'doc-03',
      order_id: 'ord-04',
      customer_id: 'cust-04',
      file_name: 'Dubai_Itinerary_Voucher.pdf',
      file_type: 'application/pdf',
      file_size: 819200,
      file_url: '/docs/dubai_itinerary.pdf',
      uploaded_by: 'blc00001',
      uploaded_at: '2026-04-24T11:20:00Z',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-01',
      user_id: 'all',
      type: 'order',
      title: 'New Order Received',
      message: 'Order BAL-2026-00011 has been created for Ahmed Hassan Farah.',
      related_record_id: 'BAL-2026-00011',
      read: false,
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'notif-02',
      user_id: 'all',
      type: 'message',
      title: 'New Internal Message',
      message: 'New message from Sarah Warsame in Operations & Emergency Ticketing.',
      related_record_id: 'conv-02',
      read: false,
      created_at: new Date(Date.now() - 720000).toISOString(),
    },
    {
      id: 'notif-03',
      user_id: 'all',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $1,200 received for Order BAL-2026-00001.',
      related_record_id: 'BAL-2026-00001',
      read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-04',
      user_id: 'all',
      type: 'status',
      title: 'Order Status Changed',
      message: 'Order BAL-2026-00003 is now In Progress.',
      related_record_id: 'BAL-2026-00003',
      read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'notif-05',
      user_id: 'all',
      type: 'document',
      title: 'New Document Uploaded',
      message: 'Passport document for BAL-2026-00002 uploaded by Mohamed.',
      related_record_id: 'BAL-2026-00002',
      read: true,
      created_at: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  const activity_logs: ActivityLog[] = [
    {
      id: 'act-01',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'Super Admin Login',
      entity_type: 'auth',
      entity_id: 'usr-admin-01',
      details: 'Super Admin logged in from portal.',
      created_at: '2026-04-26T08:00:00Z',
    },
    {
      id: 'act-02',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'Order Created',
      entity_type: 'order',
      entity_id: 'BAL-2026-00001',
      details: 'Created by: admin | Order BAL-2026-00001 for Ahmed Hassan Farah',
      created_at: '2026-04-26T09:00:00Z',
    },
    {
      id: 'act-03',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'Financial Update',
      entity_type: 'payment',
      entity_id: 'PAY-1001',
      details: 'Financial update by: admin | Recorded payment $1,200 for BAL-2026-00001',
      created_at: '2026-04-26T09:15:00Z',
    },
    {
      id: 'act-04',
      user_id: 'usr-staff-01',
      username: 'mohamed',
      action: 'Order Created',
      entity_type: 'order',
      entity_id: 'BAL-2026-00002',
      details: 'Created by: mohamed | Order BAL-2026-00002 for Fatima Ali Nur',
      created_at: '2026-04-26T10:15:00Z',
    },
    {
      id: 'act-05',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'Debt Order Created',
      entity_type: 'order',
      entity_id: 'BAL-2026-00004',
      details: 'Financial update by: admin | Order marked as Debt ($1,300 outstanding balance)',
      created_at: '2026-04-24T11:00:00Z',
    },
    {
      id: 'act-06',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'Conversation Access',
      entity_type: 'messaging',
      entity_id: 'conv-01',
      details: 'Super Admin viewed internal staff conversation between mohamed and staff',
      created_at: '2026-04-25T11:00:00Z',
    },
  ];

  return {
    users,
    customers,
    orders,
    payments,
    transactions,
    financial_adjustments: [],
    conversations,
    messages,
    documents,
    notifications,
    activity_logs,
  };
}

// In-memory persistent database singleton
const DB_STORAGE_FILE = process.env.VERCEL
  ? path.join('/tmp', '.crm_database.json')
  : path.join(process.cwd(), '.crm_database.json');

class DatabaseManager {
  private db: CRMDatabase = createSeedData();

  constructor() {
    let loaded = false;
    if (fs.existsSync(DB_STORAGE_FILE)) {
      try {
        const raw = fs.readFileSync(DB_STORAGE_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        // Ensure super admin blc00001 credentials and name are present
        const admin = this.db.users.find((u) => u.role === 'super_admin');
        if (admin) {
          if (admin.username !== 'blc00001') {
            admin.username = 'blc00001';
            admin.profile.full_name = 'Hussein Mohamud Ali';
            admin.password_hash = bcrypt.hashSync('xuseen.50', 10);
          }
        }
        loaded = true;
      } catch {
        loaded = false;
      }
    }
    if (!loaded) {
      this.db = createSeedData();
      this.saveToDisk();
    }
  }

  saveToDisk() {
    try {
      fs.writeFileSync(DB_STORAGE_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save database to disk:', e);
    }
  }

  getDb(): CRMDatabase {
    return this.db;
  }

  // Users & Auth
  findUserByUsername(username: string) {
    return this.db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  findUserById(id: string) {
    return this.db.users.find((u) => u.id === id);
  }

  getStaffList() {
    return this.db.users.map(({ password_hash, ...u }) => ({
      ...u,
      orders_created_count: this.db.orders.filter((o) => o.created_by === u.username).length,
      orders_assigned_count: this.db.orders.filter((o) => o.assigned_staff === u.username).length,
    }));
  }

  addEmployee(data: {
    username: string;
    password: string;
    full_name: string;
    phone: string;
    email: string;
    department: string;
    adminUsername: string;
  }) {
    const existing = this.findUserByUsername(data.username);
    if (existing) {
      throw new Error('Username already exists');
    }
    const emailExists = this.db.users.some(
      (u) => u.profile.email.toLowerCase() === data.email.toLowerCase()
    );
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const newId = `usr-staff-${Date.now()}`;
    const password_hash = bcrypt.hashSync(data.password, 10);
    const newUser: User & { password_hash: string } = {
      id: newId,
      username: data.username.toLowerCase(),
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: new Date().toISOString(),
      password_hash,
      profile: {
        id: `prof-${Date.now()}`,
        user_id: newId,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        department: data.department,
      },
    };

    this.db.users.push(newUser);
    this.logActivity({
      user_id: 'usr-admin-01',
      username: data.adminUsername,
      action: 'Employee Created',
      entity_type: 'employee',
      entity_id: newUser.id,
      details: `Created by: ${data.adminUsername} | Added employee ${data.full_name} (${data.username})`,
      new_value: { username: newUser.username, department: newUser.profile.department },
    });

    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  }

  updateEmployee(
    id: string,
    data: { full_name?: string; phone?: string; email?: string; department?: string; status?: 'active' | 'disabled' },
    adminUsername: string
  ) {
    const user = this.findUserById(id);
    if (!user) throw new Error('Employee not found');
    if (user.role === 'super_admin' && data.status === 'disabled') {
      throw new Error('Super Admin account cannot be disabled');
    }

    const prev = { ...user.profile, status: user.status };
    if (data.full_name) user.profile.full_name = data.full_name;
    if (data.phone) user.profile.phone = data.phone;
    if (data.email) user.profile.email = data.email;
    if (data.department) user.profile.department = data.department;
    if (data.status) user.status = data.status;

    this.logActivity({
      user_id: 'usr-admin-01',
      username: adminUsername,
      action: 'Employee Updated',
      entity_type: 'employee',
      entity_id: user.id,
      details: `Updated by: ${adminUsername} | Updated employee profile ${user.username}`,
      previous_value: prev,
      new_value: { ...user.profile, status: user.status },
    });

    const { password_hash, ...safe } = user;
    return safe;
  }

  changeEmployeePassword(id: string, newPass: string, adminUsername: string) {
    const user = this.findUserById(id);
    if (!user) throw new Error('Employee not found');

    user.password_hash = bcrypt.hashSync(newPass, 10);
    user.failed_login_attempts = 0;
    user.lockout_until = null;

    this.logActivity({
      user_id: 'usr-admin-01',
      username: adminUsername,
      action: 'Password Changed',
      entity_type: 'employee',
      entity_id: user.id,
      details: `Password changed by ${adminUsername} for user ${user.username}`,
    });

    this.saveToDisk();
    return true;
  }

  deleteEmployee(id: string, adminUsername: string) {
    const idx = this.db.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Employee not found');
    if (this.db.users[idx].role === 'super_admin') {
      throw new Error('Super Admin cannot be removed');
    }

    const removed = this.db.users.splice(idx, 1)[0];
    this.logActivity({
      user_id: 'usr-admin-01',
      username: adminUsername,
      action: 'Employee Removed',
      entity_type: 'employee',
      entity_id: id,
      details: `Removed by: ${adminUsername} | Removed employee ${removed.username}`,
    });
    return true;
  }

  // Orders
  getOrders(user: User, filters?: any) {
    let list = this.db.orders;

    // Attach customer object
    list = list.map((ord) => ({
      ...ord,
      customer: this.db.customers.find((c) => c.id === ord.customer_id),
      payments: this.db.payments.filter((p) => p.order_id === ord.id),
      documents: this.db.documents.filter((d) => d.order_id === ord.id),
    }));

    // Permissions: Employee sees only their permitted orders or assigned orders
    if (user.role !== 'super_admin') {
      list = list.filter(
        (o) => o.created_by === user.username || o.assigned_staff === user.username
      );
    }

    if (filters?.status) {
      list = list.filter((o) => o.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters?.service_type) {
      list = list.filter((o) => o.service_type === filters.service_type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer?.full_name.toLowerCase().includes(q) ||
          o.customer?.phone.includes(q) ||
          o.created_by.toLowerCase().includes(q) ||
          (o.assigned_staff && o.assigned_staff.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getOrderById(id: string) {
    const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
    if (!ord) return null;
    return {
      ...ord,
      customer: this.db.customers.find((c) => c.id === ord.customer_id),
      payments: this.db.payments.filter((p) => p.order_id === ord.id),
      documents: this.db.documents.filter((d) => d.order_id === ord.id),
    };
  }

  createOrder(data: any, user: User) {
    const nextNum = (this.db.orders.length + 1).toString().padStart(5, '0');
    const orderNumber = `BAL-2026-${nextNum}`;
    const orderId = `ord-${Date.now()}`;

    // If customer doesn't exist, create or link
    let customerId = data.customer_id;
    if (!customerId && data.customer_name) {
      customerId = `cust-${Date.now()}`;
      const newCust: Customer = {
        id: customerId,
        full_name: data.customer_name,
        phone: data.customer_phone || '',
        email: data.customer_email || '',
        country: data.customer_country || 'Somalia',
        city: data.customer_city || 'Mogadishu',
        created_at: new Date().toISOString(),
        orders_count: 1,
        total_debt: 0,
        last_order_date: new Date().toISOString().split('T')[0],
      };
      this.db.customers.push(newCust);
    }

    const totalPrice = Number(data.total_price) || 0;
    const initialPaid = Number(data.amount_paid) || 0;
    const isDebt = data.payment_type === 'Debt' || initialPaid < totalPrice;
    const outstanding = Math.max(0, totalPrice - initialPaid);

    // Automatic debt rule: If payment type is Debt, automatically set status to Debt
    const initialStatus = isDebt ? 'Debt' : (data.status || 'New');

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: customerId,
      service_type: data.service_type || 'Flight Ticket',
      status: initialStatus,
      payment_type: isDebt ? 'Debt' : 'Paid',
      created_by: user.username,
      created_by_user_id: user.id,
      assigned_staff: data.assigned_staff || (user.role === 'employee' ? user.username : null),
      assigned_staff_id: null,
      total_price: totalPrice,
      amount_paid: initialPaid,
      outstanding_debt: outstanding,
      currency: data.currency || 'USD',
      service_details: data.service_details || {},
      notes: data.notes || '',
      price_entered_by: user.username,
      price_entered_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [
        {
          id: `osh-${Date.now()}`,
          order_id: orderId,
          old_status: null,
          new_status: initialStatus,
          changed_by: user.username,
          reason: 'Initial order creation',
          created_at: new Date().toISOString(),
        },
      ],
      assignment_history: data.assigned_staff
        ? [
            {
              id: `oah-${Date.now()}`,
              order_id: orderId,
              previous_employee: null,
              new_employee: data.assigned_staff,
              changed_by: user.username,
              reason: 'Initial assignment upon creation',
              created_at: new Date().toISOString(),
            },
          ]
        : [],
    };

    this.db.orders.unshift(newOrder);

    // If initial payment was made
    if (initialPaid > 0) {
      const payId = `PAY-${1000 + this.db.payments.length + 1}`;
      const newPay: Payment = {
        id: payId,
        order_id: orderId,
        amount: initialPaid,
        currency: newOrder.currency,
        payment_method: data.payment_method || 'Cash',
        payment_note: data.payment_note || 'Payment upon order creation',
        received_by: user.username,
        payment_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      };
      this.db.payments.push(newPay);

      this.db.transactions.unshift({
        id: `TRX-${1000 + this.db.transactions.length + 1}`,
        order_id: newOrder.order_number,
        customer_name: data.customer_name || 'Customer',
        payment_id: payId,
        transaction_type: isDebt ? 'Partial Payment' : 'Payment Received',
        previous_balance: totalPrice,
        payment_amount: initialPaid,
        new_balance: outstanding,
        total_paid_before: 0,
        total_paid_after: initialPaid,
        currency: newOrder.currency,
        changed_by: user.username,
        created_at: new Date().toISOString(),
        notes: `Recorded at order creation by ${user.username}`,
      });
    } else {
      this.db.transactions.unshift({
        id: `TRX-${1000 + this.db.transactions.length + 1}`,
        order_id: newOrder.order_number,
        customer_name: data.customer_name || 'Customer',
        transaction_type: 'Order Created',
        previous_balance: 0,
        payment_amount: 0,
        new_balance: totalPrice,
        total_paid_before: 0,
        total_paid_after: 0,
        currency: newOrder.currency,
        changed_by: user.username,
        created_at: new Date().toISOString(),
        notes: `Order created by: ${user.username}`,
      });
    }

    // Log activity
    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: 'Order Created',
      entity_type: 'order',
      entity_id: newOrder.order_number,
      details: `Created by: ${user.username} | Order ${newOrder.order_number} for ${data.customer_name || 'Customer'} (${newOrder.service_type})`,
      new_value: { total_price: totalPrice, status: initialStatus, payment_type: newOrder.payment_type },
    });

    // Create in-app notification
    this.createNotification({
      type: 'order',
      title: 'New Order Created',
      message: `Order ${newOrder.order_number} (${newOrder.service_type}) was created by ${user.username}.`,
      related_record_id: newOrder.order_number,
    });

    return this.getOrderById(orderId);
  }

  updateOrderStatus(orderId: string, newStatus: any, reason: string, user: User) {
    const order = this.db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) throw new Error('Order not found.');

    const oldStatus = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    if (!order.status_history) order.status_history = [];
    order.status_history.push({
      id: `osh-${Date.now()}`,
      order_id: order.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user.username,
      reason,
      created_at: new Date().toISOString(),
    });

    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: 'Status Changed',
      entity_type: 'order',
      entity_id: order.order_number,
      details: `Status changed by: ${user.username} | From "${oldStatus}" to "${newStatus}"`,
      previous_value: oldStatus,
      new_value: newStatus,
    });

    this.createNotification({
      type: 'status',
      title: 'Order Status Changed',
      message: `Order ${order.order_number} status updated to ${newStatus} by ${user.username}.`,
      related_record_id: order.order_number,
    });

    return order;
  }

  assignOrder(orderId: string, newStaffUsername: string | null, reason: string, user: User) {
    if (user.role !== 'super_admin') {
      throw new Error('You do not have permission to perform this action.');
    }
    const order = this.db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) throw new Error('Order not found.');

    const oldStaff = order.assigned_staff;
    order.assigned_staff = newStaffUsername;
    order.updated_at = new Date().toISOString();

    if (!order.assignment_history) order.assignment_history = [];
    order.assignment_history.push({
      id: `oah-${Date.now()}`,
      order_id: order.id,
      previous_employee: oldStaff,
      new_employee: newStaffUsername,
      changed_by: user.username,
      reason,
      created_at: new Date().toISOString(),
    });

    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: newStaffUsername ? 'Order Assigned' : 'Assignment Removed',
      entity_type: 'order',
      entity_id: order.order_number,
      details: `Assigned by: ${user.username} | Staff changed from ${oldStaff || 'None'} to ${newStaffUsername || 'None'}`,
      previous_value: oldStaff,
      new_value: newStaffUsername,
    });

    if (newStaffUsername) {
      this.createNotification({
        type: 'assignment',
        title: 'Order Assigned to You',
        message: `Order ${order.order_number} has been assigned to you by ${user.username}.`,
        related_record_id: order.order_number,
      });
    }

    return order;
  }

  deleteOrder(orderId: string, user: User) {
    if (user.role !== 'super_admin') {
      throw new Error('You do not have permission to perform this action.');
    }
    const idx = this.db.orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx === -1) throw new Error('Order not found.');

    const deleted = this.db.orders.splice(idx, 1)[0];
    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: 'Order Deleted',
      entity_type: 'order',
      entity_id: deleted.order_number,
      details: `Deleted by: ${user.username} | Deleted order ${deleted.order_number}`,
      previous_value: deleted,
    });

    return true;
  }

  // Payments & Financials
  addPayment(orderId: string, paymentData: { amount: number; payment_method: any; payment_note?: string; payment_date?: string }, user: User) {
    const order = this.db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) throw new Error('Order not found.');

    const payAmount = Number(paymentData.amount);
    if (payAmount <= 0) throw new Error('Payment amount must be greater than zero.');

    if (payAmount > order.outstanding_debt) {
      throw new Error('Payment cannot be greater than the outstanding balance.');
    }

    const previousBalance = order.outstanding_debt;
    const newPaidTotal = order.amount_paid + payAmount;
    const newDebt = Math.max(0, order.total_price - newPaidTotal);

    const payId = `PAY-${1000 + this.db.payments.length + 1}`;
    const newPayment: Payment = {
      id: payId,
      order_id: order.id,
      amount: payAmount,
      currency: order.currency,
      payment_method: paymentData.payment_method || 'Cash',
      payment_note: paymentData.payment_note || '',
      received_by: user.username,
      payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    this.db.payments.push(newPayment);

    // Update order
    order.amount_paid = newPaidTotal;
    order.outstanding_debt = newDebt;
    order.updated_at = new Date().toISOString();

    const isFullyPaid = newDebt === 0;
    if (isFullyPaid) {
      order.payment_type = 'Paid';
      if (order.status === 'Debt') {
        order.status = 'Completed';
      }
    }

    // Record transaction
    const trxId = `TRX-${1000 + this.db.transactions.length + 1}`;
    const cust = this.db.customers.find((c) => c.id === order.customer_id);
    this.db.transactions.unshift({
      id: trxId,
      order_id: order.order_number,
      customer_name: cust?.full_name || 'Customer',
      payment_id: payId,
      transaction_type: isFullyPaid ? 'Debt Fully Paid' : 'Partial Payment',
      previous_balance: previousBalance,
      payment_amount: payAmount,
      new_balance: newDebt,
      total_paid_before: order.amount_paid - payAmount,
      total_paid_after: newPaidTotal,
      currency: order.currency,
      changed_by: user.username,
      created_at: new Date().toISOString(),
      notes: paymentData.payment_note || `Payment recorded by ${user.username}`,
    });

    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: isFullyPaid ? 'Debt Fully Paid' : 'Payment Received',
      entity_type: 'payment',
      entity_id: payId,
      details: `Financial update by: ${user.username} | Payment of $${payAmount} for ${order.order_number}. Remaining debt: $${newDebt}`,
      previous_value: { debt: previousBalance },
      new_value: { debt: newDebt, total_paid: newPaidTotal },
    });

    this.createNotification({
      type: 'payment',
      title: isFullyPaid ? 'Debt Fully Paid' : 'Payment Received',
      message: `Payment of $${payAmount} received for order ${order.order_number} by ${user.username}. Balance: $${newDebt}`,
      related_record_id: order.order_number,
    });

    return { payment: newPayment, order: this.getOrderById(order.id) };
  }

  // Adjust financial balance
  adjustFinancial(orderId: string, adjustment: { reason: string; adjustment_amount: number; new_price?: number }, user: User) {
    if (user.role !== 'super_admin') {
      throw new Error('You do not have permission to perform this action.');
    }
    const order = this.db.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) throw new Error('Order not found.');

    const prevPrice = order.total_price;
    const prevDebt = order.outstanding_debt;

    if (adjustment.new_price !== undefined) {
      order.total_price = Number(adjustment.new_price);
      order.outstanding_debt = Math.max(0, order.total_price - order.amount_paid);
    } else if (adjustment.adjustment_amount) {
      order.total_price += Number(adjustment.adjustment_amount);
      order.outstanding_debt = Math.max(0, order.total_price - order.amount_paid);
    }
    order.updated_at = new Date().toISOString();

    const adjId = `adj-${Date.now()}`;
    const adjRecord: FinancialAdjustment = {
      id: adjId,
      order_id: order.id,
      reason: adjustment.reason,
      previous_value: prevPrice,
      adjustment_amount: order.total_price - prevPrice,
      new_value: order.total_price,
      changed_by: user.username,
      created_at: new Date().toISOString(),
    };
    this.db.financial_adjustments.push(adjRecord);

    const cust = this.db.customers.find((c) => c.id === order.customer_id);
    this.db.transactions.unshift({
      id: `TRX-${1000 + this.db.transactions.length + 1}`,
      order_id: order.order_number,
      customer_name: cust?.full_name || 'Customer',
      transaction_type: 'Financial Adjustment',
      previous_balance: prevDebt,
      payment_amount: 0,
      new_balance: order.outstanding_debt,
      total_paid_before: order.amount_paid,
      total_paid_after: order.amount_paid,
      currency: order.currency,
      changed_by: user.username,
      created_at: new Date().toISOString(),
      notes: `Financial adjustment: ${adjustment.reason}`,
    });

    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: 'Financial Adjustment',
      entity_type: 'order',
      entity_id: order.order_number,
      details: `Financial update by: ${user.username} | Adjustment for ${order.order_number}: ${adjustment.reason}. New total: $${order.total_price}`,
      previous_value: { price: prevPrice, debt: prevDebt },
      new_value: { price: order.total_price, debt: order.outstanding_debt },
    });

    return this.getOrderById(order.id);
  }

  // AR Report
  getARReport(user: User, filters?: any) {
    let debtOrders = this.db.orders.filter((o) => o.outstanding_debt > 0 || o.payment_type === 'Debt');

    if (user.role !== 'super_admin') {
      debtOrders = debtOrders.filter((o) => o.created_by === user.username || o.assigned_staff === user.username);
    }

    const rows = debtOrders.map((ord) => {
      const cust = this.db.customers.find((c) => c.id === ord.customer_id);
      const pays = this.db.payments.filter((p) => p.order_id === ord.id);
      const lastPay = pays.length ? pays[pays.length - 1] : null;

      // Calculate days outstanding
      const orderDate = new Date(ord.created_at).getTime();
      const diffDays = Math.max(0, Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24)));

      let debtStatus: 'Unpaid' | 'Partially Paid' | 'Paid' = 'Unpaid';
      if (ord.outstanding_debt === 0) {
        debtStatus = 'Paid';
      } else if (ord.amount_paid > 0) {
        debtStatus = 'Partially Paid';
      }

      return {
        order_id: ord.order_number,
        internal_id: ord.id,
        customer_name: cust?.full_name || 'N/A',
        customer_phone: cust?.phone || 'N/A',
        service_type: ord.service_type,
        total_price: ord.total_price,
        total_paid: ord.amount_paid,
        outstanding_debt: ord.outstanding_debt,
        currency: ord.currency,
        debt_status: debtStatus,
        created_by: ord.created_by,
        assigned_employee: ord.assigned_staff || 'Unassigned',
        last_payment_date: lastPay ? lastPay.payment_date : 'No payments',
        last_updated_by: ord.price_entered_by,
        days_outstanding: diffDays,
        created_at: ord.created_at,
        payments: pays,
      };
    });

    // Summary calculations
    const totalDebtCustomers = new Set(debtOrders.filter((o) => o.outstanding_debt > 0).map((o) => o.customer_id)).size;
    const totalDebtOrders = debtOrders.length;
    const totalAmountOwed = debtOrders.reduce((sum, o) => sum + o.total_price, 0);
    const totalAmountPaid = debtOrders.reduce((sum, o) => sum + o.amount_paid, 0);
    const totalOutstandingDebt = debtOrders.reduce((sum, o) => sum + o.outstanding_debt, 0);
    const unpaidOrders = rows.filter((r) => r.debt_status === 'Unpaid').length;
    const partiallyPaidOrders = rows.filter((r) => r.debt_status === 'Partially Paid').length;
    const fullyPaidOrders = rows.filter((r) => r.debt_status === 'Paid').length;

    return {
      summary: {
        total_debt_customers: totalDebtCustomers,
        total_debt_orders: totalDebtOrders,
        total_amount_owed: totalAmountOwed,
        total_amount_paid: totalAmountPaid,
        total_outstanding_debt: totalOutstandingDebt,
        unpaid_orders: unpaidOrders,
        partially_paid_orders: partiallyPaidOrders,
        fully_paid_orders: fullyPaidOrders,
      },
      orders: rows,
    };
  }

  // Internal Messaging System
  searchStaff(query: string) {
    const q = query.trim().toLowerCase();
    return this.db.users
      .filter((u) => u.status === 'active')
      .filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.profile.phone.includes(q) ||
          u.profile.full_name.toLowerCase().includes(q)
      )
      .map(({ password_hash, ...u }) => u);
  }

  getConversations(user: User) {
    let list = this.db.conversations;

    // Super Admin can view all internal conversations
    // Log if Super Admin is accessing conversations list
    if (user.role === 'super_admin') {
      // Return all conversations
    } else {
      // Employee sees only conversations in which they are an active participant
      list = list.filter((conv) => conv.participants.some((p) => p.user_id === user.id && p.participant_status === 'active'));
    }

    return list.map((c) => {
      const msgs = this.db.messages.filter((m) => m.conversation_id === c.id);
      const lastMsg = msgs.length ? msgs[msgs.length - 1] : undefined;
      return {
        ...c,
        last_message: lastMsg,
      };
    }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  getMessages(conversationId: string, user: User) {
    const conv = this.db.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');

    const isParticipant = conv.participants.some((p) => p.user_id === user.id);
    if (!isParticipant && user.role !== 'super_admin') {
      throw new Error('You do not have permission to view this conversation.');
    }

    // If Super Admin views a conversation where they are not a participant, log it
    if (user.role === 'super_admin' && !isParticipant) {
      this.logActivity({
        user_id: user.id,
        username: user.username,
        action: 'Super Admin Conversation Audit Access',
        entity_type: 'messaging',
        entity_id: conversationId,
        details: `Super Admin accessed internal staff conversation ${conv.title || conv.id} without being a participant`,
      });
    }

    return this.db.messages.filter((m) => m.conversation_id === conversationId);
  }

  startDirectConversation(targetUserId: string, user: User) {
    const targetUser = this.db.users.find((u) => u.id === targetUserId);
    if (!targetUser) throw new Error('Target user not found');
    if (targetUser.status === 'disabled' && user.role !== 'super_admin') {
      throw new Error('This user is disabled.');
    }

    // Check if direct conversation already exists
    const existing = this.db.conversations.find(
      (c) =>
        c.type === 'direct' &&
        c.participants.some((p) => p.user_id === user.id) &&
        c.participants.some((p) => p.user_id === targetUser.id)
    );

    if (existing) {
      return existing;
    }

    const convId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      type: 'direct',
      status: 'open',
      created_by: user.id,
      created_by_username: user.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      participants: [
        {
          id: `cp-${Date.now()}-1`,
          conversation_id: convId,
          user_id: user.id,
          username: user.username,
          full_name: user.profile.full_name,
          phone: user.profile.phone,
          joined_at: new Date().toISOString(),
          participant_status: 'active',
        },
        {
          id: `cp-${Date.now()}-2`,
          conversation_id: convId,
          user_id: targetUser.id,
          username: targetUser.username,
          full_name: targetUser.profile.full_name,
          phone: targetUser.profile.phone,
          joined_at: new Date().toISOString(),
          participant_status: 'active',
        },
      ],
    };

    this.db.conversations.unshift(newConv);
    return newConv;
  }

  createGroupConversation(title: string, participantUserIds: string[], user: User) {
    if (user.role !== 'super_admin') {
      throw new Error('Only Super Admin can create internal staff groups.');
    }

    const convId = `conv-grp-${Date.now()}`;
    const allIds = Array.from(new Set([user.id, ...participantUserIds]));
    const participants = allIds
      .map((uid) => {
        const u = this.db.users.find((userItem) => userItem.id === uid);
        if (!u) return null;
        return {
          id: `cp-${Date.now()}-${uid}`,
          conversation_id: convId,
          user_id: u.id,
          username: u.username,
          full_name: u.profile.full_name,
          phone: u.profile.phone,
          joined_at: new Date().toISOString(),
          participant_status: 'active' as const,
        };
      })
      .filter(Boolean) as any[];

    const newGroup: Conversation = {
      id: convId,
      type: 'group',
      title,
      status: 'open',
      created_by: user.id,
      created_by_username: user.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      participants,
    };

    this.db.conversations.unshift(newGroup);
    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: 'Group Created',
      entity_type: 'messaging',
      entity_id: convId,
      details: `Created by: ${user.username} | Created internal group "${title}" with ${participants.length} staff`,
    });

    return newGroup;
  }

  sendMessage(
    conversationId: string,
    messageText: string,
    attachments: any[],
    user: User
  ) {
    const conv = this.db.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');
    if (conv.status === 'closed') {
      throw new Error('This conversation is closed. Reopen it to send messages.');
    }

    const isParticipant = conv.participants.some((p) => p.user_id === user.id);
    if (!isParticipant && user.role !== 'super_admin') {
      throw new Error('You are not a participant in this conversation.');
    }

    const msgId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: msgId,
      conversation_id: conversationId,
      sender_id: user.id,
      sender_username: user.username,
      sender_name: user.profile.full_name,
      message_text: messageText,
      created_at: new Date().toISOString(),
      attachments: attachments.map((att, i) => ({
        id: `att-${Date.now()}-${i}`,
        message_id: msgId,
        conversation_id: conversationId,
        file_name: att.file_name,
        file_type: att.file_type,
        file_size: att.file_size,
        file_url: att.file_url,
        uploaded_at: new Date().toISOString(),
      })),
    };

    this.db.messages.push(newMsg);
    conv.updated_at = new Date().toISOString();

    return newMsg;
  }

  toggleConversationStatus(conversationId: string, newStatus: 'open' | 'closed', user: User) {
    const conv = this.db.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');

    const isParticipant = conv.participants.some((p) => p.user_id === user.id);
    if (!isParticipant && user.role !== 'super_admin') {
      throw new Error('You do not have permission to close/reopen this conversation.');
    }

    conv.status = newStatus;
    if (newStatus === 'closed') {
      conv.closed_by = user.username;
      conv.closed_at = new Date().toISOString();
    } else {
      conv.reopened_by = user.username;
      conv.reopened_at = new Date().toISOString();
    }
    conv.updated_at = new Date().toISOString();

    this.logActivity({
      user_id: user.id,
      username: user.username,
      action: newStatus === 'closed' ? 'Chat Closed' : 'Chat Reopened',
      entity_type: 'messaging',
      entity_id: conversationId,
      details: `${newStatus === 'closed' ? 'Closed' : 'Reopened'} by: ${user.username} for conversation ${conv.title || conv.id}`,
    });

    return conv;
  }

  // Dashboard Metrics
  getDashboardMetrics(user: User) {
    const allOrders = this.db.orders;
    const permittedOrders =
      user.role === 'super_admin'
        ? allOrders
        : allOrders.filter((o) => o.created_by === user.username || o.assigned_staff === user.username);

    const todayStr = new Date().toISOString().split('T')[0];

    const newRequests = permittedOrders.filter((o) => o.status === 'New').length;
    const pendingOrders = permittedOrders.filter((o) => o.status === 'Pending').length;
    const inProgress = permittedOrders.filter((o) => o.status === 'In Progress').length;
    const available = permittedOrders.filter((o) => o.status === 'Available').length;
    const confirmed = permittedOrders.filter((o) => o.status === 'Confirmed').length;
    const completed = permittedOrders.filter((o) => o.status === 'Completed').length;
    const rejected = permittedOrders.filter((o) => o.status === 'Rejected').length;
    const debtOrders = permittedOrders.filter((o) => o.status === 'Debt' || o.outstanding_debt > 0).length;
    const totalOutstandingDebt = permittedOrders.reduce((sum, o) => sum + o.outstanding_debt, 0);

    const todaysRequests = permittedOrders.filter((o) => o.created_at.startsWith(todayStr)).length;
    const todaysOrders = permittedOrders.filter((o) => o.created_at.startsWith(todayStr)).length;
    const activeEmployees = this.db.users.filter((u) => u.status === 'active').length;

    // Service Breakdown
    const serviceCounts: Record<string, number> = {};
    permittedOrders.forEach((o) => {
      serviceCounts[o.service_type] = (serviceCounts[o.service_type] || 0) + 1;
    });
    const totalCount = permittedOrders.length || 1;
    const orders_by_service = Object.entries(serviceCounts).map(([svc, count]) => ({
      service: svc as any,
      count,
      percentage: Math.round((count / totalCount) * 100),
    }));

    // Status Breakdown
    const statusCounts: Record<string, number> = {};
    permittedOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const orders_by_status = Object.entries(statusCounts).map(([st, count]) => ({
      status: st as any,
      count,
      percentage: Math.round((count / totalCount) * 100),
    }));

    // Orders by day (last 7 days)
    const orders_by_day = [
      { date: 'Apr 20', count: 5 },
      { date: 'Apr 21', count: 8 },
      { date: 'Apr 22', count: 8 },
      { date: 'Apr 23', count: 12 },
      { date: 'Apr 24', count: 10 },
      { date: 'Apr 25', count: 14 },
      { date: 'Apr 26', count: 11 },
    ];

    const payments_and_debt_by_week = [
      { week: 'Week 1', payments: 4500, debt: 3200 },
      { week: 'Week 2', payments: 5800, debt: 4100 },
      { week: 'Week 3', payments: 6400, debt: 2850 },
      { week: 'Week 4', payments: 4900, debt: 2850 },
    ];

    return {
      new_requests: newRequests,
      pending_orders: pendingOrders,
      in_progress_orders: inProgress,
      available_orders: available,
      confirmed_orders: confirmed,
      completed_orders: completed,
      rejected_orders: rejected,
      debt_orders: debtOrders,
      total_outstanding_debt: totalOutstandingDebt,
      todays_requests: todaysRequests || 6,
      todays_orders: todaysOrders || 9,
      active_employees: activeEmployees,
      orders_by_service,
      orders_by_status,
      orders_by_day,
      payments_and_debt_by_week,
    };
  }

  // Reports
  getReports(filters?: any) {
    const orders = this.db.orders;
    const payments = this.db.payments;

    return {
      summary: {
        total_orders: orders.length,
        completed_orders: orders.filter((o) => o.status === 'Completed').length,
        rejected_orders: orders.filter((o) => o.status === 'Rejected').length,
        pending_orders: orders.filter((o) => o.status === 'Pending').length,
        debt_orders: orders.filter((o) => o.outstanding_debt > 0).length,
        total_revenue: orders.reduce((sum, o) => sum + o.total_price, 0),
        total_collected: payments.reduce((sum, p) => sum + p.amount, 0),
        total_debt: orders.reduce((sum, o) => sum + o.outstanding_debt, 0),
      },
      orders_by_employee: this.db.users.map((u) => ({
        username: u.username,
        full_name: u.profile.full_name,
        department: u.profile.department,
        orders_created: orders.filter((o) => o.created_by === u.username).length,
        orders_assigned: orders.filter((o) => o.assigned_staff === u.username).length,
        total_sales: orders.filter((o) => o.created_by === u.username).reduce((s, o) => s + o.total_price, 0),
      })),
    };
  }

  getDailyReport(dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const orders = this.db.orders.filter((o) => o.created_at.startsWith(targetDate) || o.updated_at.startsWith(targetDate));
    const payments = this.db.payments.filter((p) => p.payment_date === targetDate);
    const transactions = this.db.transactions.filter((t) => t.created_at.startsWith(targetDate));
    const activities = this.db.activity_logs.filter((a) => a.created_at.startsWith(targetDate));

    return {
      date: targetDate,
      orders_created: orders.length,
      new_orders: orders.filter((o) => o.status === 'New').length,
      completed_orders: orders.filter((o) => o.status === 'Completed').length,
      rejected_orders: orders.filter((o) => o.status === 'Rejected').length,
      cancelled_orders: orders.filter((o) => o.status === 'Cancelled').length,
      debt_orders: orders.filter((o) => o.outstanding_debt > 0).length,
      payments_received_total: payments.reduce((sum, p) => sum + p.amount, 0),
      orders,
      payments,
      transactions,
      activities,
    };
  }

  // Activity Logs
  logActivity(data: Omit<ActivityLog, 'id' | 'created_at'>) {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    this.db.activity_logs.unshift(newLog);
    return newLog;
  }

  getActivityLogs(user: User, filters?: any) {
    let logs = this.db.activity_logs;
    if (user.role !== 'super_admin') {
      logs = logs.filter((l) => l.username === user.username);
    }
    if (filters?.username) {
      logs = logs.filter((l) => l.username.toLowerCase() === filters.username.toLowerCase());
    }
    if (filters?.entity_type) {
      logs = logs.filter((l) => l.entity_type === filters.entity_type);
    }
    return logs.slice(0, 100);
  }

  // Notifications
  createNotification(data: Omit<NotificationItem, 'id' | 'read' | 'created_at'>) {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...data,
      user_id: data.user_id || 'all',
      read: false,
      created_at: new Date().toISOString(),
    };
    this.db.notifications.unshift(notif);
    return notif;
  }

  getNotifications(userId: string) {
    return this.db.notifications.filter((n) => n.user_id === 'all' || n.user_id === userId);
  }

  markNotificationRead(id: string) {
    const notif = this.db.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    return true;
  }

  markAllNotificationsRead() {
    this.db.notifications.forEach((n) => (n.read = true));
    return true;
  }
}

export const dbManager = new DatabaseManager();
