import { Expect, expect } from "@playwright/test"
export class DeliveryDetails {
    constructor(page) {
        this.page = page

        this.firstName = page.getByPlaceholder('First name')
        this.lastName = page.getByPlaceholder('Last name')
        this.street = page.getByPlaceholder('Street')
        this.postCode = page.getByPlaceholder('Post code')
        this.city = page.getByPlaceholder('City')
        this.countryDropDown = page.locator('[data-qa="country-dropdown"]')
        this.saveAddressBtn = page.getByRole('button', { name: 'Save address for next time' })
        this.continueToPaymentBtn = page.getByRole('button', { name: 'Continue to payment' })
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]')

        this.savedFirstName = page.locator('[data-qa="saved-address-firstName"]')
        this.savedLastName = page.locator('[data-qa="saved-address-lastName"]')
        this.savedStreet = page.locator('[data-qa="saved-address-street"]')
        this.savedPostCode = page.locator('data-qa="saved-address-postcode"]')
        this.savedCity = page.locator('[data-qa="saved-address-city"]')
        this.savedCountry = page.locator('[data-qa="saved-address-country"]')
    }

    fillDetails = async (userAddress) => {
        await this.firstName.fill(userAddress.firstName)
        await this.lastName.fill(userAddress.lastName)
        await this.street.fill(userAddress.street)
        await this.postCode.fill(userAddress.postCode)
        await this.city.fill(userAddress.city)
        await this.countryDropDown.selectOption(userAddress.countryDropDown)
    }

    saveDetails = async () => {
        const addressCountBeforeSave = await this.savedAddressContainer.count()
        await this.saveAddressBtn.waitFor()
        await this.saveAddressBtn.click()
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSave + 1)
       
        await this.savedFirstName.first().waitFor()
        expect (await this.savedFirstName.first().innerText()).toBe(await this.firstName.inputValue())
        
        await this.savedLastName.first().waitFor()
        expect (await this.savedLastName.first().innerText()).toBe(await this.lastName.inputValue())

        await this.savedCountry.first().waitFor()
        expect (await this.savedCountry.first().innerText()).toBe(await this.countryDropDown.inputValue())
    }

    continueToPayment = async () => {
        await this.continueToPaymentBtn.waitFor()
        await this.continueToPaymentBtn.click()
        await this.page.waitForURL(/\/payment/, {timeout:3000})
    }
}