"use client";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { useEffect } from "react";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Response object:", res); // Kiểm tra xem res có phải là NextApiResponse không
  
}
