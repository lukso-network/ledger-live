import { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly buttonsGroup: Locator;
  readonly settingsButton: Locator;
  readonly settingsDeleteButton: Locator;
  readonly settingsConfirmButton: Locator;
  readonly swapButton: Locator;
  readonly buyButton: Locator;
  readonly sellButton: Locator;
  readonly stakeButton: Locator;
  readonly stakeBanner: Locator;
  readonly stakeBannerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonsGroup = page.locator("data-test-id=account-buttons-group");
    this.settingsButton = page.locator("data-test-id=account-settings-button");
    this.settingsDeleteButton = page.locator("data-test-id=account-settings-delete-button");
    this.settingsConfirmButton = page.locator("data-test-id=modal-confirm-button");
    this.swapButton = page.locator("data-test-id=swap-account-action-button");
    this.buyButton = page.locator("data-test-id=buy-button");
    this.sellButton = page.locator("data-test-id=sell-button");
    this.stakeButton = page.locator("data-test-id=stake-from-account-action-button");
    this.stakeBanner = page.locator("data-test-id=account-stake-banner");
    this.stakeBannerButton = page.locator("data-test-id=account-stake-banner-button");
  }

  async navigateToSwap() {
    await this.swapButton.click();
  }

  async navigateToBuy() {
    await this.buyButton.click();
  }

  async navigateToSell() {
    await this.sellButton.click();
  }

  async startStakingFlowFromMainStakeButton() {
    await this.stakeButton.click();
  }

  async clickBannerCTA() {
    await this.stakeBannerButton.scrollIntoViewIfNeeded();
    await this.stakeBannerButton.click();
  }

  async scrollToOperations() {
    await this.page.locator("id=operation-list").scrollIntoViewIfNeeded();
  }

  /**
   * Delete account from account itself
   */
  async deleteAccount() {
    await this.settingsButton.click();
    await this.settingsDeleteButton.click();
    await this.settingsConfirmButton.click();
  }
}
