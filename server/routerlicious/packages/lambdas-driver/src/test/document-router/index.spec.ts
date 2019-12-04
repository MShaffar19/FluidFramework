/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IPartitionLambdaFactory } from "@microsoft/fluid-server-services-core";
import { TestContext } from "@microsoft/fluid-server-test-utils";
import * as assert from "assert";
import * as nconf from "nconf";
import * as path from "path";
import * as plugin from "../../document-router";

describe("document-router", () => {
    describe("Plugin", () => {
        const defaultConfig = {
            documentLambda: path.join(__dirname, "./testDocumentLambda"),
        };

        let factory: IPartitionLambdaFactory;
        let config: nconf.Provider;

        beforeEach(async () => {
            config = (new nconf.Provider({})).defaults(defaultConfig).use("memory");
            factory = await plugin.create(config);
        });

        describe(".create", () => {
            it("Should be able to create a new lambda", async () => {
                const context = new TestContext();
                const lambda = await factory.create(config, context);
                assert.ok(lambda);
            });
        });
    });
});