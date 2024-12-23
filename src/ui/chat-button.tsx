"use client";

import { useChat } from "ai/react";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { ProductList } from "./commercegpt/product-list";
import { Button } from "./shadcn/button";
import { Card } from "./shadcn/card";
import { Input } from "./shadcn/input";

export function ChatButton() {
	const [isOpen, setIsOpen] = useState(false);
	const { messages, input, handleInputChange, handleSubmit, append } = useChat({});

	return (
		<>
			{/* Chat Button */}
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
			>
				{isOpen ? <X size={24} /> : <MessageCircle size={24} />}
			</Button>

			{/* Chat Window */}
			{isOpen && (
				<Card
					className={`
    fixed bottom-20 right-4 w-[400px] h-[600px] shadow-xl flex flex-col
    transition-all duration-300 ease-in-out
    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
  `}
				>
					<div className="p-4 border-b">
						<h3 className="font-semibold">Customer Support</h3>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-auto p-4 space-y-4">
						{messages.length === 0 && (
							<div className="flex flex-col items-center justify-center h-full space-y-4">
								<h4 className="text-lg font-medium">Welcome to YNS Store!</h4>
								<p className="text-sm text-gray-500 text-center">How can we help you today?</p>
								<div className="flex flex-wrap justify-center gap-2">
									<Button
										variant="outline"
										onClick={() => append({ role: "user", content: "Show me some bags" })}
									>
										Show me some bags
									</Button>
									<Button
										variant="outline"
										onClick={() => append({ role: "user", content: "Show me cool sunglasses" })}
									>
										Looking for cool glasses
									</Button>
								</div>
							</div>
						)}

						{messages.map((m) => (
							<div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
								<div
									className={`rounded-lg px-4 py-2 max-w-[80%] ${
										m.role === "user"
											? "bg-blue-500 text-white"
											: m.toolInvocations?.length
												? "bg-transparent"
												: "bg-gray-100"
									}`}
								>
									{m.content}
									{m.toolInvocations?.map((ti) => (
										<div key={ti.toolCallId}>
											{ti.state === "result" && (
												<>
													{ti.toolName === "productSearch" ? (
														ti.result.length === 0 ? (
															<p>No results found</p>
														) : (
															<div className="mt-2">
																<ProductList products={ti.result} />
																<Button
																	variant="outline"
																	className="mt-2 w-full"
																	onClick={() =>
																		append({
																			role: "user",
																			content: "Add the first product to the cart",
																		})
																	}
																>
																	Add to Cart
																</Button>
															</div>
														)
													) : (
														<div className="mt-2 bg-gray-100 rounded-lg px-4 py-2">{ti.result}</div>
													)}
												</>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Input Area */}
					<form onSubmit={handleSubmit} className="p-4 border-t">
						<div className="flex gap-2">
							<Input
								value={input}
								onChange={handleInputChange}
								placeholder="Ask about products..."
								className="flex-1"
							/>
							<Button type="submit">Send</Button>
						</div>
					</form>
				</Card>
			)}
		</>
	);
}
