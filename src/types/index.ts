export type Task = {
	title: string
	urgency: 'urgent' | 'not urgent' | null
	importance: 'important' | 'not important' | null
	userId: string
}

export type User = {
	email: string
	password: string
}

export type Session = {
	sessionToken: string
	userId: string
}

export enum Status {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger',
}

declare global {
	namespace Express {
		interface Request {
			identity: string
		}
	}
}
