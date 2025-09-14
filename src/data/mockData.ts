// Mock data for the civic reporting system

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  photos: string[];
  dateSubmitted: string;
  dateAcknowledged?: string;
  dateInProgress?: string;
  dateResolved?: string;
  assignedDepartment?: string;
  publicNotes: string[];
  internalNotes: string[];
}

export const mockReports: Report[] = [
  {
    id: "RPT-2024-001",
    title: "Pothole on Main Street",
    description: "Large pothole causing damage to vehicles. Located near the intersection with Oak Avenue.",
    category: "Road Maintenance",
    status: "in-progress",
    priority: "high",
    citizenName: "John Smith",
    citizenEmail: "john.smith@email.com",
    citizenPhone: "(555) 123-4567",
    location: {
      address: "123 Main Street, Springfield",
      lat: 40.7128,
      lng: -74.0060
    },
    photos: ["/placeholder.svg"],
    dateSubmitted: "2024-01-15T10:30:00Z",
    dateAcknowledged: "2024-01-15T14:20:00Z",
    dateInProgress: "2024-01-16T09:00:00Z",
    assignedDepartment: "Public Works",
    publicNotes: [
      "Issue acknowledged and assigned to Public Works department.",
      "Crew scheduled for repair on January 18th."
    ],
    internalNotes: [
      "High priority due to location on main thoroughfare.",
      "Materials ordered for repair."
    ]
  },
  {
    id: "RPT-2024-002",
    title: "Broken Street Light",
    description: "Street light has been out for several days, creating safety concerns for pedestrians.",
    category: "Street Lighting",
    status: "resolved",
    priority: "medium",
    citizenName: "Sarah Johnson",
    citizenEmail: "sarah.j@email.com",
    location: {
      address: "456 Elm Street, Springfield",
      lat: 40.7589,
      lng: -73.9851
    },
    photos: ["/placeholder.svg"],
    dateSubmitted: "2024-01-10T18:45:00Z",
    dateAcknowledged: "2024-01-11T08:30:00Z",
    dateInProgress: "2024-01-11T13:15:00Z",
    dateResolved: "2024-01-12T16:00:00Z",
    assignedDepartment: "Electrical Services",
    publicNotes: [
      "Issue acknowledged and assigned to Electrical Services.",
      "Replacement light installed successfully."
    ],
    internalNotes: [
      "Standard LED replacement required.",
      "Completed on schedule."
    ]
  },
  {
    id: "RPT-2024-003",
    title: "Graffiti on Public Building",
    description: "Offensive graffiti on the side of the community center building.",
    category: "Vandalism",
    status: "submitted",
    priority: "low",
    citizenName: "Michael Brown",
    citizenEmail: "m.brown@email.com",
    location: {
      address: "789 Pine Street, Springfield",
      lat: 40.7505,
      lng: -73.9934
    },
    photos: ["/placeholder.svg"],
    dateSubmitted: "2024-01-20T12:00:00Z",
    assignedDepartment: "Parks and Recreation",
    publicNotes: [],
    internalNotes: []
  }
];

export const categories = [
  "Road Maintenance",
  "Street Lighting",
  "Vandalism",
  "Trash Collection",
  "Water Issues",
  "Parks and Recreation",
  "Noise Complaints",
  "Traffic Signals",
  "Sidewalk Repair",
  "Other"
];

export const departments = [
  "Public Works",
  "Electrical Services",
  "Parks and Recreation",
  "Water Department",
  "Code Enforcement",
  "Traffic Management"
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'status-submitted';
    case 'acknowledged':
    case 'in-progress':
      return 'status-progress';
    case 'resolved':
      return 'status-resolved';
    default:
      return 'muted';
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'secondary';
    case 'acknowledged':
    case 'in-progress':
      return 'default';
    case 'resolved':
      return 'default';
    default:
      return 'outline';
  }
};