import { describe, it, beforeEach, expect } from "vitest"

describe("Encryption Contract", () => {
  let mockStorage: Map<string, any>
  let nextMessageId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextMessageId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "encrypt-and-send":
        const [recipient, content] = args
        nextMessageId++
        mockStorage.set(`message-${nextMessageId}`, {
          sender: sender,
          recipient: recipient,
          encrypted_content: Buffer.from(`encrypted-${content}`).toString("hex"),
        })
        return { success: true, value: nextMessageId }
      
      case "get-encrypted-message":
        return { success: true, value: mockStorage.get(`message-${args[0]}`) }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should encrypt and send a message", () => {
    const result = mockContractCall("encrypt-and-send", ["user2", "Hello, World!"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get an encrypted message", () => {
    mockContractCall("encrypt-and-send", ["user2", "Hello, World!"], "user1")
    const result = mockContractCall("get-encrypted-message", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      sender: "user1",
      recipient: "user2",
      encrypted_content: expect.any(String),
    })
  })
})

