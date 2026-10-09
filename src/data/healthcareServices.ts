export interface HealthcareServiceItem {
  id: string;
  name: string;
  shortDescription: string;
  iconName: string;
  category: 'primary' | 'specialist' | 'screening' | 'support';
}

export const HEALTHCARE_SERVICES: HealthcareServiceItem[] = [
  {
    id: 'general_medical',
    name: 'General Medical Care',
    shortDescription: 'Doctor consultations, physical examinations, and basic outpatient treatments',
    iconName: 'Stethoscope',
    category: 'primary'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    shortDescription: 'Teeth scaling, polishing, tooth extraction, and oral health checkups',
    iconName: 'Smile',
    category: 'specialist'
  },
  {
    id: 'eye_care',
    name: 'Eye Care & Optometry',
    shortDescription: 'Visual acuity testing, cataract screening, and free reading glasses',
    iconName: 'Eye',
    category: 'specialist'
  },
  {
    id: 'maternal_health',
    name: 'Maternal Health',
    shortDescription: 'Antenatal consultations, ultrasound scans, and postnatal guidance',
    iconName: 'HeartHandshake',
    category: 'specialist'
  },
  {
    id: 'child_health',
    name: 'Child Health & Pediatrics',
    shortDescription: 'Well-child exams, growth monitoring, deworming, and nutritional guidance',
    iconName: 'Baby',
    category: 'specialist'
  },
  {
    id: 'vaccination',
    name: 'Vaccination & Immunization',
    shortDescription: 'Routine childhood vaccines, tetanus, hepatitis, and preventive boosters',
    iconName: 'Syringe',
    category: 'primary'
  },
  {
    id: 'malaria',
    name: 'Malaria Screening & Treatment',
    shortDescription: 'Rapid diagnostic tests (RDT) and ACT antimalarial medications',
    iconName: 'Activity',
    category: 'screening'
  },
  {
    id: 'blood_pressure',
    name: 'Blood Pressure Screening',
    shortDescription: 'Hypertension checks, cardiovascular assessments, and counseling',
    iconName: 'Heart',
    category: 'screening'
  },
  {
    id: 'blood_glucose',
    name: 'Blood Glucose Screening',
    shortDescription: 'Random and fasting blood sugar testing for diabetes detection',
    iconName: 'Droplet',
    category: 'screening'
  },
  {
    id: 'lab_testing',
    name: 'Laboratory Diagnostics',
    shortDescription: 'Urinalysis, PCV/blood counts, lipid profiles, and rapid test kits',
    iconName: 'FlaskConical',
    category: 'screening'
  },
  {
    id: 'medication',
    name: 'Free Medication / Pharmacy',
    shortDescription: 'Dispensing of antibiotics, analgesics, vitamins, and chronic meds',
    iconName: 'Pill',
    category: 'primary'
  },
  {
    id: 'cancer_screening',
    name: 'Cancer Screening',
    shortDescription: 'Cervical visual inspection (VIA) and clinical breast examinations',
    iconName: 'ShieldAlert',
    category: 'screening'
  },
  {
    id: 'mental_health',
    name: 'Mental Health Support',
    shortDescription: 'Psychological first aid, counseling, and mental wellness guidance',
    iconName: 'Brain',
    category: 'support'
  },
  {
    id: 'health_education',
    name: 'Health Education',
    shortDescription: 'Workshops on hygiene, nutrition, chronic disease prevention, and sanitation',
    iconName: 'BookOpen',
    category: 'support'
  },
  {
    id: 'other',
    name: 'Other Health Services',
    shortDescription: 'Physiotherapy, wound dressing, assistive devices, and referral triage',
    iconName: 'PlusCircle',
    category: 'support'
  }
];

export const SERVICE_NAMES_LIST = HEALTHCARE_SERVICES.map(s => s.name);
