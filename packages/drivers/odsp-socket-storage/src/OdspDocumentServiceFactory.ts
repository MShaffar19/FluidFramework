/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITelemetryBaseLogger } from "@microsoft/fluid-container-definitions";
import { ChildLogger } from "@microsoft/fluid-core-utils";
import {
  IDocumentService,
  IDocumentServiceFactory,
  IResolvedUrl,
} from "@microsoft/fluid-driver-definitions";
import { IOdspResolvedUrl } from "./contracts";
import { FetchWrapper, IFetchWrapper } from "./fetchWrapper";
import { getSocketIo } from "./getSocketIo";
import { OdspCache } from "./odspCache";
import { OdspDocumentService } from "./OdspDocumentService";

/**
 * Factory for creating the sharepoint document service. Use this if you want to
 * use the sharepoint implementation.
 */
export class OdspDocumentServiceFactory implements IDocumentServiceFactory {
  public readonly protocolName = "fluid-odsp:";
  /**
   * @param appId - app id used for telemetry for network requests.
   * @param getStorageToken - function that can provide the storage token for a given site. This is
   * is also referred to as the "VROOM" token in SPO.
   * @param getWebsocketToken - function that can provide a token for accessing the web socket. This is also
   * referred to as the "Push" token in SPO.
   * @param logger - a logger that can capture performance and diagnostic information
   * @param storageFetchWrapper - if not provided FetchWrapper will be used
   * @param deltasFetchWrapper - if not provided FetchWrapper will be used
   */
  constructor(
    private readonly appId: string,
    private readonly getStorageToken: (siteUrl: string, refresh: boolean) => Promise<string | null>,
    private readonly getWebsocketToken: () => Promise<string | null>,
    private readonly logger: ITelemetryBaseLogger,
    private readonly storageFetchWrapper: IFetchWrapper = new FetchWrapper(),
    private readonly deltasFetchWrapper: IFetchWrapper = new FetchWrapper(),
    private readonly odspCache: OdspCache = new OdspCache(),
  ) { }

  public async createDocumentService(resolvedUrl: IResolvedUrl): Promise<IDocumentService> {
    const odspResolvedUrl = resolvedUrl as IOdspResolvedUrl;
    return new OdspDocumentService(
      this.appId,
      odspResolvedUrl.hashedDocumentId,
      odspResolvedUrl.siteUrl,
      odspResolvedUrl.driveId,
      odspResolvedUrl.itemId,
      odspResolvedUrl.endpoints.snapshotStorageUrl,
      this.getStorageToken,
      this.getWebsocketToken,
      ChildLogger.create(this.logger, "fluid:telemetry:OdspDriver"),
      this.storageFetchWrapper,
      this.deltasFetchWrapper,
      Promise.resolve(getSocketIo()),
      this.odspCache,
    );
  }
}
