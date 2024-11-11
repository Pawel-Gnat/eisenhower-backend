import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import { Status } from '../types'

// Factory function
export const createResponseHelpers = (res: express.Response) => {
	return {
		sendFulfilledResponseWithData: (object: any, httpStatus: number, message: string, status: Status) =>
			res.status(httpStatus).json({ object, message, status }),

		sendFulfilledResponseWithCookie: (token: string, httpStatus: number, message: string, status: Status) =>
			res
				.status(httpStatus)
				.cookie('authorization', token, {
					httpOnly: true,
					secure: true,
					sameSite: 'none',
					maxAge: 12 * 60 * 60 * 1000,
					path: '/',
				})
				.json({ token, message, status }),

		sendFulfilledResponseWithoutData: (httpStatus: number, message: string, status: Status) =>
			res.status(httpStatus).json({ message, status }),

		sendRejectedResponse: (httpStatus: number, message: string, status: Status) =>
			res.status(httpStatus).json({ error: message, status }),
	}
}

export const capitalizeFirstLetter = (string: string) => {
	const lowerCased = string.toLowerCase()
	return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1)
}

export const normalizeString = (input: string) => {
	return capitalizeFirstLetter(input.trim().replace(/\s+/g, ' '))
}

export const generateAccessToken = (userId: { id: string }) => {
	return jwt.sign(userId, `${process.env.ACCESS_TOKEN_SECRET}`, {
		expiresIn: '12h',
	})
}

export const verifyToken = (sessionToken: string) => {
	return jwt.verify(sessionToken, `${process.env.ACCESS_TOKEN_SECRET}`)
}
