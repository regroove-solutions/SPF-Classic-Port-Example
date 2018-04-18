import { override } from "@microsoft/decorators";
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from "@microsoft/sp-application-base";
import { SPPermission } from "@microsoft/sp-page-context";
import { Promise } from "es6-promise";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WarningWindowComponent } from "./components/warning-window";

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ClassicExampleApplicationCustomizer
  extends BaseApplicationCustomizer<{}> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    this._renderPlaceHolders();
    return Promise.resolve();
  }
  private _renderPlaceHolders(): void {

    this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(", ");


    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

      if (!this._topPlaceholder) {
        return;
      }

      if (this.properties) {

        if (this._topPlaceholder.domElement) {

          ReactDOM.render(
            React.createElement(
              WarningWindowComponent,
              this.context.pageContext.web.permissions.hasPermission(SPPermission.managePermissions)
            ),
            this._topPlaceholder.domElement);
        }
      }
    }
  }
}
