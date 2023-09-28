const {stringify} = require('csv-stringify');
const xml2js = require('xml2js')

/**
 * Detects the format of the incoming data and converts it to a unified format that can be processed by the system.
 * @param {string} data - The incoming data to be converted.
 * @returns {string} The converted data in a unified format.
 */
function formatConversion(data) {
    const format = detectFormat(data);
    switch (format) {
        case 'JSON':
            return convertToJSON(data);
        case 'CSV':
            return convertToCSV(data);
        case 'XML':
            return convertToXML(data);
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

/**
 * Detects the format of the incoming data.
 * @param {string} data - The incoming data to be detected.
 * @returns {string} The detected format of the data.
 */
function detectFormat(data) {
    const fileExtension = detectFileExtension(data);
    if (fileExtension) {
        return mapFileExtensionToFormat(fileExtension);
    }
    const mimeType = detectMimeType(data);
    if (mimeType) {
        return mapMimeTypeToFormat(mimeType);
    }
    return sniffContent(data);
}

/**
 * Extracts the file extension from the incoming data and maps it to a corresponding format.
 * @param {string} data - The incoming data to be examined.
 * @returns {string|null} The file extension of the data, or null if not found.
 */
function detectFileExtension(data) {
    // Use regex to match the file extension
    const match = data.match(/\.([a-z]+)$/i);
    return match ? match[1].toUpperCase() : null;
}

/**
 * Maps the file extension to a corresponding format.
 * @param {string} fileExtension - The file extension to be mapped.
 * @returns {string} The corresponding format of the file extension.
 * @throws {Error} If the file extension is not supported.
 */
function mapFileExtensionToFormat(fileExtension) {
    switch (fileExtension) {
        case 'JSON':
        case 'CSV':
        case 'XML':
            return fileExtension;
        default:
            throw new Error(`Unsupported file extension: ${fileExtension}`);
    }
}

/**
 * Extracts the MIME type from the incoming data and maps it to a corresponding format.
 * @param {string} data - The incoming data to be examined.
 * @returns {string|null} The MIME type of the data, or null if not found.
 */
function detectMimeType(data) {
    // Use a library such as mime-types to match the MIME type
    return null;
}

/**
 * Maps the MIME type to a corresponding format.
 * @param {string} mimeType - The MIME type to be mapped.
 * @returns {string} The corresponding format of the MIME type.
 * @throws {Error} If the MIME type is not supported.
 */
function mapMimeTypeToFormat(mimeType) {
    switch (mimeType) {
        case 'application/json':
            return 'JSON';
        case 'text/csv':
            return 'CSV';
        case 'application/xml':
            return 'XML';
        default:
            throw new Error(`Unsupported MIME type: ${mimeType}`);
    }
}

/**
 * Infers the format of the incoming data based on its structure and syntax.
 * @param {string} data - The incoming data to be examined.
 * @returns {string} The inferred format of the data.
 * @throws {Error} If the format cannot be inferred.
 */
function sniffContent(data) {
    // Use techniques such as pattern matching, heuristics, or machine learning to identify the format
    if (typeof data !== 'string') {
        throw new Error('Data must be a string');
    }

    if (data.trim() === '') {
        throw new Error('Data cannot be empty');
    }

    if (data.startsWith('{') && data.endsWith('}')) {
        return 'JSON';
    }

    if (data.startsWith('<') && data.endsWith('>')) {
        return 'XML';
    }

    if (data.includes(',')) {
        return 'CSV';
    }

    throw new Error('Cannot infer format');
}

/**
 * Converts the incoming data to JSON format.
 * @param {string} data - The incoming data to be converted.
 * @returns {string} The converted data in JSON format.
 * @throws {Error} If the conversion fails.
 */
function convertToJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Cannot convert to JSON: ${error.message}`);
    }
}

/**
 * Converts the incoming data to CSV format.
 * @param {string} data - The incoming data to be converted.
 * @returns {string} The converted data in CSV format.
 * @throws {Error} If the conversion fails.
 */
function convertToCSV(data) {
    try {
        const jsonData = JSON.parse(data);
        return new Promise((resolve, reject) => {
            stringify(jsonData, {header: true}, (error, csvData) => {
                if (error) {
                    reject(new Error(`Cannot convert to CSV: ${error.message}`));
                } else {
                    resolve(csvData);
                }
            });
        });
    } catch (error) {
        throw new Error(`Cannot convert to CSV: ${error.message}`);
    }
}

/**
 * Converts the incoming data to XML format.
 * @param {string} data - The incoming data to be converted.
 * @returns {string} The converted data in XML format.
 * @throws {Error} If the conversion fails.
 */
function convertToXML(data) {
    return new Promise((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(data, (error, result) => {
            if (error) {
                reject(new Error(`Cannot convert to XML: ${error.message}`));
            } else {
                resolve(new xml2js.Builder().buildObject(result));
            }
        });
    });
}

module.exports = {
    formatConversion,
    detectFormat,
    detectFileExtension,
    mapFileExtensionToFormat,
    detectMimeType,
    mapMimeTypeToFormat,
    sniffContent,
    convertToJSON,
    convertToCSV,
    convertToXML,
};