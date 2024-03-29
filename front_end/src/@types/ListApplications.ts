import ViewModel from "../view-models/ViewModel";

export interface ApplicationCardProps {
  name: string;
  date: string;
  status: string;
}

export interface ViewProps {
  applications: {
    application_id: number;
    fullName: string;
    status: string;
    applicationDate: string /**Adjusted */;
    fromDate: Date;
    toDate: Date;
  }[];
}

export interface ControllerProps {
  viewModel: ViewModel;
}
