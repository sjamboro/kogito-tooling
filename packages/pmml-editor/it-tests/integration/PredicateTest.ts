/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe("Predicate Test", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.fixture("emptyWithData.pmml").then((fileContent) => {
      cy.get("[data-ouia-component-id='upload-button']+input").should("not.be.visible").attachFile({
        fileContent: fileContent.toString(),
        fileName: "emptyWithData.pmml",
        mimeType: "text/plain",
        encoding: "utf-8",
      });
    });
  });

  it("Define Predicate", () => {
    cy.ouiaId("characteristics")
      .should("be.visible")
      .within(() => {
        cy.ouiaId("add-characteristic").click();

        cy.ouiaId("edit-characteristic").within(() => {
          cy.ouiaId("characteristic-name-input").type("{selectall}{del}Char1");
          cy.ouiaId("characteristic-reason-code-input").type("10");
          cy.ouiaId("characteristic-baseline-score-input").type("5");
          cy.ouiaId("add-attribute").click();
        });

        cy.ouiaId("edit-attribute").within(() => {
          cy.ouiaId("predicate").find("div:first").type("{ctrl}a{del}test>3");
          cy.ouiaId("attribute-partial-score").type("5");
        });
        cy.ouiaId("attribute-done").click();

        cy.ouiaType("filler").should("be.visible").click();
        cy.get("[data-ouia-component-type='characteristic-item']:contains('Char1')")
          .should("be.visible")
          .within(() => {
            cy.get("span.characteristic-list__item__label").should(($label) => {
              expect($label).to.have.length(3);
              expect($label[0]).to.have.text("Reason code:\u00A010");
              expect($label[1]).to.have.text("Baseline score:\u00A05");
              expect($label[2]).to.have.text("test > 3");
            });
            cy.get("span.attribute-list__item__label").should(($label) => {
              expect($label).to.have.length(1);
              expect($label[0]).to.have.text("Partial score:\u00A05");
            });
          });
      });
  });
});
