import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.STOCK_API_URL;

export async function GET() {
	try {
		const response = await axios.get(API_URL);
		const data = response.data;

		const stockData = {
			oneMonth: data.find((item: any) => item.name === "1 Months")?.stock || 0,
			threeMonths:
				data.find((item: any) => item.name === "3 Months")?.stock || 0,
		};

		return NextResponse.json(stockData);
	} catch (error) {
		console.error("Failed to fetch stock:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stock" },
			{ status: 500 },
		);
	}
}
