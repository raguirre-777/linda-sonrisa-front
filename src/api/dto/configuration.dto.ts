export interface ConfigurationDto {
    id?: number;
    name: string;
    url: string;
    emailFrom: string;
    emailFromName: string;
    smtpHost: string;
    smtpPort: number;
    smtpUserName: string;
    smtpPassword: string;
}