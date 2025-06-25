import contentstack from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page } from "./types";
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

const region = getRegionForString(import.meta.env.VITE_CONTENTSTACK_REGION as string);
const endpoints = getContentstackEndpoints(region, true)

export const stack = contentstack.stack({
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
  region,
  live_preview: {
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    preview_token: import.meta.env.VITE_CONTENTSTACK_PREVIEW_TOKEN,
    host: endpoints.preview
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false,
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
      environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host: endpoints.application
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

export async function getPages() {
  const result = await stack
    .contentType("page")
    .entry()
    .includeReference(["blocks.block"])
    .includeMetadata()
    .query()
    .find();

  if (result.entries) {

    result.entries.map((entry) => {
      if (import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true') {
        contentstack.Utils.addEditableTags(entry as Page, 'page', true);
      }
    });


    return result.entries;
  }
}