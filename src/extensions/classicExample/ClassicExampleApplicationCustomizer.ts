import * as React from "react";
import * as ReactDOM from "react-dom";

import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from "@microsoft/sp-application-base";

import * as strings from "ClassicExampleApplicationCustomizerStrings";
import { Promise } from "es6-promise";
import { SPPermission } from "@microsoft/sp-page-context";
import { WarningWindowComponent } from "./components/warning-window";

const LOG_SOURCE: string = "ClassicExampleApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IClassicExampleApplicationCustomizerProperties {
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ClassicExampleApplicationCustomizer
  extends BaseApplicationCustomizer<IClassicExampleApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

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
