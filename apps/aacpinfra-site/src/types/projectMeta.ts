// apps/aacpinfra-site/src/data/projectMeta.ts

export const projectMeta: Record<
  string,
  {
    ongoing: boolean;
    location?: {
      lat: number;
      lng: number;
      label: string;
    };
  }
> = {
  "walkway-works": {
    ongoing: true,
    location: {
      lat: 12.8231,
      lng: 77.6846,
      label: "Toyota Kirloskar Motor, Bidadi",
    },
  },

  "bosch-management-facility-centre": {
    ongoing: true,
    location: {
      lat: 12.8926,
      lng: 77.6804,
      label: "BOSCH, Bengaluru",
    },
  },
};
