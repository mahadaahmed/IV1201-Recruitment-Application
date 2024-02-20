import ApplicantViewModel from "../view-models/ApplicantViewModel";

export interface ViewProps {
  username: string;
  onLogout: () => void;
}

export interface ControllerProps {
  viewModel: ApplicantViewModel;
}
