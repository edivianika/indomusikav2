"use server"

import { createClient } from "./supabase/server"

interface OrderData {
  nama: string
  noHp: string
  namaUsaha: string
  jenisUsaha: string
  targetAudiens: string
  gayaMusik: string[]
  pesanUtama: string
  tagline: string
}

export async function submitOrder(orderData: OrderData) {
  const supabase = createClient()

  try {
    // Get available CS (rolling assignment based on status = true)
    const { data: availableCS, error: csError } = await supabase
      .from("customer_services")
      .select("*")
      .eq("status", true)
      .order("id")

    if (csError) {
      console.error("Error fetching CS:", csError)
      throw new Error("Failed to assign customer service")
    }

    if (!availableCS || availableCS.length === 0) {
      throw new Error("No customer service available")
    }

    // Get the last assigned CS to implement rolling
    const { data: lastOrder } = await supabase
      .from("orders")
      .select("cs_id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Find next CS in rolling sequence
    let selectedCS = availableCS[0] // Default to first CS
    if (lastOrder?.cs_id) {
      const lastCSIndex = availableCS.findIndex((cs) => cs.id === lastOrder.cs_id)
      const nextIndex = (lastCSIndex + 1) % availableCS.length
      selectedCS = availableCS[nextIndex]
    }

    // Insert order with assigned CS
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        nama: orderData.nama,
        nohp: orderData.noHp,
        nama_usaha: orderData.namaUsaha,
        jenis_usaha: orderData.jenisUsaha,
        target_audiens: orderData.targetAudiens,
        gaya_musik: orderData.gayaMusik,
        pesan_utama: orderData.pesanUtama,
        tagline: orderData.tagline,
        cs_id: selectedCS.id,
        cs_phone: selectedCS.nohp,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      throw new Error("Failed to create order")
    }

    return {
      success: true,
      order,
      csPhone: selectedCS.nohp,
      csName: selectedCS.nama,
    }
  } catch (error) {
    console.error("Submit order error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
