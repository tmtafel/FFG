import { User } from 'firebase';

export interface UserResponse {
    pageToken: string;
    users: User[];
}
