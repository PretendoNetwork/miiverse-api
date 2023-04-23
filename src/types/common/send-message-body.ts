export interface SendMessageBody {
	message_to_pid: number;
	body: string;
	painting?: string;
	screenshot?: string;
	app_data?: string;
}