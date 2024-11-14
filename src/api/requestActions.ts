'use server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchTitle = async (url: string) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        return $('title').text() || url;
    } catch (error) {
        console.error('Error fetching title:', error);
        return url;
    }
};