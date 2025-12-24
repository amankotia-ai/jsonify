import { RequestMethod } from '../types';

interface ParsedCurl {
    url: string;
    method: RequestMethod;
    headers: Record<string, string>;
    body: string;
}

export const parseCurlCommand = (curl: string): ParsedCurl => {
    const result: ParsedCurl = {
        url: '',
        method: 'GET',
        headers: {},
        body: ''
    };

    if (!curl || typeof curl !== 'string') return result;

    // Remove newlines and extra spaces to make parsing easier
    const cleanCurl = curl.replace(/\\\n/g, ' ').replace(/\n/g, ' ').trim();

    if (!cleanCurl.toLowerCase().startsWith('curl')) return result;

    // Extract URL - first argument that isn't a flag
    // This is a naive extraction, but covers most common cases
    // We split by spaces but respect quotes
    const args: string[] = [];
    let currentArg = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < cleanCurl.length; i++) {
        const char = cleanCurl[i];

        if ((char === '"' || char === "'") && (i === 0 || cleanCurl[i - 1] !== '\\')) {
            if (!inQuote) {
                inQuote = true;
                quoteChar = char;
            } else if (char === quoteChar) {
                inQuote = false;
            } else {
                currentArg += char;
            }
        } else if (char === ' ' && !inQuote) {
            if (currentArg) {
                args.push(currentArg);
                currentArg = '';
            }
        } else {
            currentArg += char;
        }
    }
    if (currentArg) args.push(currentArg);

    // Parse arguments
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];

        if (arg === '-X' || arg === '--request') {
            if (i + 1 < args.length) {
                const method = args[i + 1].toUpperCase();
                if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
                    result.method = method as RequestMethod;
                    i++; // Skip next arg
                }
            }
        } else if (arg === '-H' || arg === '--header') {
            if (i + 1 < args.length) {
                const header = args[i + 1];
                const colonIndex = header.indexOf(':');
                if (colonIndex > 0) {
                    const key = header.substring(0, colonIndex).trim();
                    const value = header.substring(colonIndex + 1).trim();
                    result.headers[key] = value;
                    i++;
                }
            }
        } else if (arg === '-d' || arg === '--data' || arg === '--data-raw' || arg === '--data-binary') {
            if (i + 1 < args.length) {
                result.body = args[i + 1];
                if (result.method === 'GET') {
                    result.method = 'POST'; // cURL defaults to POST if data is present
                }
                i++;
            }
        } else if (arg.startsWith('http') || arg.startsWith('www')) {
            // Likely the URL if not already set (or if we skipped flags correctly)
            if (!result.url) {
                result.url = arg;
            }
        }
    }

    // Fallback for URL if not found in args loop (sometimes it's just a positional arg without flags)
    if (!result.url) {
        // Find first arg that looks like a URL and isn't a flag value
        for (let i = 1; i < args.length; i++) {
            const arg = args[i];
            if (!arg.startsWith('-') && (arg.startsWith('http') || arg.includes('://'))) {
                // Check if it was consumed as a value for a flag
                const prev = args[i - 1];
                if (!['-X', '--request', '-H', '--header', '-d', '--data', '--data-raw', '--data-binary'].includes(prev)) {
                    result.url = arg;
                    break;
                }
            }
        }
    }

    // If we still haven't found a URL, but have args, maybe the last arg is the URL?
    // Curl usually puts URL at the end
    if (!result.url && args.length > 1) {
        const lastArg = args[args.length - 1];
        if (!lastArg.startsWith('-')) {
            result.url = lastArg;
        }
    }


    return result;
};
