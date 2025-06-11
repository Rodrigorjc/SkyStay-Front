// En types/AvailabilityResponse.ts
export interface AvailabilityResponse {
    response: {
        objects: {
            roomId: string;
            availableDateRanges: {
                startDate: string;
                endDate: string;
            }[];
        }[];
    };
    messages: {
        message: string;
        code: number;
        date: string;
    };
}