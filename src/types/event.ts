export interface SportEvent {
  "@context"?: string;
  "@type"?: string;
  "@id"?: string;
  eventAttendanceMode: string;
  eventStatus: string;
  name: string;
  url: string;
  startDate: string;
  endDate: string;
  image: string;
  location?: string;
  description: string;
  eventType?: string;
  subRaces?: string[];
  organizer?: {
    "@type": string;
    name: string;
    url: string;
  }[];
}
