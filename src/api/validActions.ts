'use server';

export async function validateAccessCode(password?: string) {
    if (!process.env.ACCESS_CODE) {
        return true;
    }
    return password === process.env.ACCESS_CODE;
}

export async function validateEditCode(password?: string) {
    if (!process.env.EDIT_CODE) {
        return true;
    }
    return password === process.env.EDIT_CODE;
}
