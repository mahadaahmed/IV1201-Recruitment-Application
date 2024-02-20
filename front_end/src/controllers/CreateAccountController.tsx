import { Component } from "react";
import { ControllerProps } from "../@types/CreateAccount";
import CreateAccountView from "../views/CreateAccountView/CreateAccountView";
// import { observer } from "mobx-react";

// @observer
export default class CreateAccountController extends Component<ControllerProps> {
  private onCreateAccount = async (
    firstName: string,
    lastName: string,
    email: string,
    personNumber: string,
    username: string,
    password: string
  ) => {
    const success: boolean = await this.props.viewModel.createAccount(
      firstName,
      lastName,
      email,
      personNumber,
      username,
      password
    );
    if (success) console.log("Create account success");
    else console.log("Create account failure");
  };

  render(): React.ReactNode {
    return <CreateAccountView onCreateAccount={this.onCreateAccount} />;
  }
}
