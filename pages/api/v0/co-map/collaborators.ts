import fs from 'fs';
import path from 'path';
import {NextApiRequest, NextApiResponse} from 'next';
import parseCSV from 'csv-parse/lib/sync';
import {CSVToOptionDataResponse} from '../../../../utils/csv';

export default (req: NextApiRequest, res: NextApiResponse) => {
    const {method} = req;

    // only GET is allowed
    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);

        return;
    }

    const response: CSVToOptionDataResponse = {
        data: [],
        hasData: false,
    };

    let fileContent: string = JSON.stringify([]);
    try {
        fileContent = fs.readFileSync(
            path.resolve(`./public/projects/co-map/collaborators.csv`),
            'utf8',
        );

        response.hasData = true;

        const records = parseCSV(fileContent, {
            columns: true,
            skip_empty_lines: true,
        });

        response.data = records;
        response.hasData = true;

        res.status(200).json(records);
        return;
    } catch (e) {
        res.status(500).json({error: e});
    }
};
