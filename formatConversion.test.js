const assert = require('assert');
const formatConversion = require('./formatConversion');

describe('formatConversion', () => {
    describe('detectFormat', () => {
        it('should detect JSON format from file extension', () => {
            const data = '{"foo": "bar"}';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'JSON');
        });

        it('should detect CSV format from file extension', () => {
            const data = 'foo,bar\n1,2\n3,4';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'CSV');
        });

        it('should detect XML format from file extension', () => {
            const data = '<root><foo>bar</foo></root>';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'XML');
        });

        it('should detect JSON format from MIME type', () => {
            const data = '{"foo": "bar"}';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'JSON');
        });

        it('should detect CSV format from MIME type', () => {
            const data = 'foo,bar\n1,2\n3,4';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'CSV');
        });

        it('should detect XML format from MIME type', () => {
            const data = '<root><foo>bar</foo></root>';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'XML');
        });

        it('should infer JSON format from content', () => {
            const data = '{"foo": "bar"}';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'JSON');
        });

        it('should infer CSV format from content', () => {
            const data = 'foo,bar\n1,2\n3,4';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'CSV');
        });

        it('should infer XML format from content', () => {
            const data = '<root><foo>bar</foo></root>';
            const result = formatConversion.detectFormat(data);
            assert.strictEqual(result, 'XML');
        });

        it('should throw error for unknown format', () => {
            const data = 'foo: bar';
            assert.throws(() => formatConversion.detectFormat(data), /Cannot infer/);
        });
    });

    describe('convertToJSON', () => {
        it('should convert valid JSON data', () => {
            const data = '{"foo": "bar"}';
            const result = formatConversion.convertToJSON(data);
            assert.deepStrictEqual(result, {foo: 'bar'});
        });

        it('should throw error for invalid JSON data', () => {
            const data = '{foo: "bar"}';
            assert.throws(() => formatConversion.convertToJSON(data), /Cannot convert to JSON/);
        });
    });

    describe('convertToCSV', () => {
        it('should convert valid JSON data to CSV', async () => {
            const data = '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]';
            const result = await formatConversion.convertToCSV(data);
            assert.strictEqual(result, 'name,age\nJohn,30\nJane,25\n');
        });

        it('should throw error for invalid CSV data', () => {
            const data = 'foo,bar\n1,2\n3';
            assert.throws(() => formatConversion.convertToCSV(data), /Cannot convert to CSV/);
        });
    });

    describe('convertToXML', () => {
        it('should convert valid XML data', async () => {
            const data = '<root><foo>bar</foo></root>';
            const result = await formatConversion.convertToXML(data);
            assert.strictEqual(result, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>\n  <foo>bar</foo>\n</root>');
        });

        it('should throw error for invalid XML data', async () => {
            const data = '<root><foo>bar</bar></root>';
            await assert.rejects(() => formatConversion.convertToXML(data), /Cannot convert to XML/);
        });
    });
});