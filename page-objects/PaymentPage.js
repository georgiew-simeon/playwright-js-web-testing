import { Expect, expect } from "@playwright/test"
export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
            .locator('[data-qa="discount-code"]')
        // Locating elements in iFrame
        this.discountField = page.locator('[data-qa="discount-code-input"]')
        this.submitDiscountBtn = page.getByRole('button', { name: 'Submit discount' })
        this.discountActivatedMsg = page.getByText('Discount activated!')
        this.oldTotalPrice = page.locator('[data-qa="total-value"]')
        this.newTotalPrice = page.locator('[data-qa="total-with-discount-value"]')

        this.cardOwner = page.getByPlaceholder('Credit card owner')
        this.cardNumber = page.getByPlaceholder('Credit card number')
        this.validUntil = page.getByPlaceholder('Valid until')
        this.cardCVC = page.getByPlaceholder('Credit card CVC')
        this.payBtn = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        // getting text with innerText()
        await this.discountField.waitFor()
        await this.discountField.fill(code)
        await expect(this.discountField).toHaveValue(code)

        // Another option for slow input fields using keyboard
        // await this.discountField.focus()
        // await this.page.keyboard.type(code, {delay: 1000})
        // await this.page.pause()
        // expect(await this.discountField.inputValue()).toBe(code)

        await this.submitDiscountBtn.waitFor()
        expect(this.discountActivatedMsg).toBeHidden('Discount activated!')

        await this.submitDiscountBtn.click()

        await this.discountActivatedMsg.waitFor()
        expect(this.discountActivatedMsg).toHaveText('Discount activated!')

        await this.oldTotalPrice.waitFor()
        const oldPrice = await this.oldTotalPrice.allInnerTexts()

        const oldPriceNum = oldPrice.map((element) => {
            const oldPriceWithOutDollar = element.replace("$", "")
            return parseInt(oldPriceWithOutDollar, 10)
        })
        const newPrice = await this.newTotalPrice.allInnerTexts()

        const newPriceNum = newPrice.map((element) => {
            const newPriceWithOutDollar = element.replace("$", "")
            return parseInt(newPriceWithOutDollar, 10)
        })

        expect(oldPriceNum > newPriceNum)
    }
    
    fillPaymentDetails = async (userCardInfo) =>{
    await this.cardOwner.fill(userCardInfo.creditCardOwner)
    await this.cardNumber.fill(userCardInfo.creditCardNumber)
    await this.validUntil.fill(userCardInfo.validDate)
    await this.cardCVC.fill(userCardInfo.cvc)
    }

    completePayment = async () => {
        await this.payBtn.waitFor()
        await this.payBtn.click()
        await this.page.waitForURL(/\/thank-you/, {timeout:3000})
        await this.page.pause()
    }
}