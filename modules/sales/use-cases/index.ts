'use server'

import { logger } from '@/lib/logger'
import { actionClient } from '@/lib/server-clients'
import { z } from 'zod'
import {
  checkIfMemberIsAllowedForStrain,
  createSaleWithItems,
  getMemberSales,
  getMemberStrainAmount,
  getSaleDetails,
  getSales,
} from '../data-access'
import {
  checkIfMemberIsAllowedForStrainInputSchema,
  createSaleWithItemsInputSchema,
  fetchMembersStrainAmountInputSchema,
} from '../data-access/schema'

export const fetchAllSalesUseCase = actionClient.action(async () => {
  try {
    const sales = await getSales()
    return { success: sales }
  } catch (error) {
    console.log('Error fetching sales', error)
    return { failure: 'Failed to fetch sales' }
  }
})

export const fetchSaleDetailsUseCase = actionClient
  .schema(z.object({ saleId: z.number().int() }))
  .action(async ({ parsedInput }) => {
    try {
      const saleDetail = await getSaleDetails(parsedInput.saleId)
      return { success: saleDetail }
    } catch (error) {
      logger.error(error)
      return {
        failure: `Failed to fetch sales details for sale id ${parsedInput.saleId}`,
      }
    }
  })

export const fetchMemberSalesUseCase = actionClient
  .schema(z.object({ memberId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    if (!parsedInput?.memberId) {
      return { failure: 'No member ID provided, cannot fetch sales' }
    }
    try {
      const sales = await getMemberSales(parsedInput.memberId)

      return { success: sales }
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
      }
    }
  })

export const fetchMembersStrainAmountUseCase = actionClient
  .schema(fetchMembersStrainAmountInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const totalAmountOfStrainPerMonth =
        await getMemberStrainAmount(parsedInput)

      return { success: totalAmountOfStrainPerMonth }
    } catch (error) {
      return {
        failure: `Failed to fetch sales for member ${parsedInput.memberId}`,
      }
    }
  })

export const checkIfMemberIsAllowedForStrainUseCase = actionClient
  .schema(checkIfMemberIsAllowedForStrainInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const isAllowed = await checkIfMemberIsAllowedForStrain(parsedInput)

      return { success: isAllowed }
    } catch (error) {
      console.log(error)
      return {
        failure: `Failed to check if member is allowed for strain ${error}`,
      }
    }
  })

export const createSaleUseCase = actionClient
  .schema(createSaleWithItemsInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await createSaleWithItems(parsedInput)
    return { success: result }
  })

//   FUNKTION Cannabis_Abgabe(Mitglied, Menge):
//     // Prüfe Mitgliedschaft
//     WENN NICHT Ist_Mitglied(Mitglied) DANN
//         RÜCKGABE Fehler("Nur Mitglieder dürfen Cannabis erhalten")

//     // Prüfe Alter
//     WENN Alter(Mitglied) < 18 DANN
//         RÜCKGABE Fehler("Cannabis-Abgabe nur an Volljährige")

//     // Prüfe Abgabeort
//     WENN NICHT Innerhalb_Befriedetes_Besitztum() DANN
//         RÜCKGABE Fehler("Abgabe nur innerhalb des befriedeten Besitztums erlaubt")

//     // Prüfe Tagesgrenze
//     WENN Tagesabgabe(Mitglied) + Menge > 25 DANN
//         RÜCKGABE Fehler("Tagesgrenze von 25g überschritten")

//     // Prüfe Monatsgrenze
//     WENN Alter(Mitglied) >= 21 DANN
//         Monatsgrenze = 50
//     SONST
//         Monatsgrenze = 30

//     WENN Monatsabgabe(Mitglied) + Menge > Monatsgrenze DANN
//         RÜCKGABE Fehler("Monatsgrenze überschritten")

//     // Prüfe THC-Gehalt für Heranwachsende
//     WENN 18 <= Alter(Mitglied) < 21 UND THC_Gehalt(Cannabis) > 10% DANN
//         RÜCKGABE Fehler("THC-Gehalt zu hoch für Heranwachsende")

//     // Prüfe Reinform
//     WENN NICHT Ist_Reinform(Cannabis) DANN
//         RÜCKGABE Fehler("Nur Abgabe in Reinform als Marihuana oder Haschisch erlaubt")

//     // Führe Abgabe durch
//     Abgabe_Durchführen(Mitglied, Menge, Cannabis)
//     Dokumentiere_Abgabe(Mitglied, Menge, Cannabis)

//     // Übergebe Informationen
//     Übergebe_Informationszettel(Mitglied, Cannabis)
//     Übergebe_Aufklärungsinformationen(Mitglied)

//     RÜCKGABE Erfolg("Cannabis erfolgreich abgegeben")

// ENDE FUNKTION
