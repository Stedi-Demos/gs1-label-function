# GS1 Label Generation

This repo includes a single Stedi Function (called `labels-gs1`) designed to generate a GS1 Logistics Label in ZPL (Zebra) and PDF formats.

The function expects an input as follows:

```json
{
  "shipFrom": {
    "line1": "Happy Publisher",
    "line2": "1234 Main St",
    "city": "Anytown",
    "state": "MD",
    "zipCode": "2814"
  },
  "shipTo": {
    "line1": "Buckle Inc.",
    "line2": "2915 W 16th Street",
    "city": "Kearney",
    "state": "NE",
    "zipCode": "68845"
  },
  "carrier": {
    "name": "United Parcel Service",
    "bol": "123456789"
  },
  "purchaseOrder": {
    "number": "123456789",
    "quantity": 1,
    "cartons": {
      "style": "T-Shirt",
      "color": "red",
      "size": "XL"
    }
  },
  "gs1": {
    "companyPrefix": "884794"
  }
}
```

And will generate a label that looks like:

[!Sample Logistics Label](./assets/sample-label.png)

**NOTE:** This function is intended for reference purposes only.

### Function flow

When invoked with a JSON payload as detailed above, the function will:

1. Use Stash to increment and persist a unique serial number (for each unique `gs1.companyPrefix` value), using the Stash keyspace configured in the `STASH_KEYPSPACE_NAME_GS1` environmental variable.

2. Combine the GS1 company prefix, along with the serial number, and calculate a check digit to form a valid SSCC number.

3. Using the open source (jszpl)[https://github.com/DanieLeeuwner/JSZPL] npm module it will generate ZPL syntax to print a standard logistics label including barcodes, using the address and order information from the input JSON.

4. Convert the ZPL to PDF using the free [Labelary.com API](http://labelary.com/).

5. Persist the ZPL and PDF files in a Stedi Bucket, as configured in the `LABEL_BUCKET_NAME` environmental variable.

6. Finally the function will return the paths to the two newly created files as its output.

## Setup & Deploy

1. Rename the `.env.example` file to `.env` and update the following environment variables:

   - `STEDI_API_KEY`: A Stedi API key is required for authentication. You
     can [generate an API key](https://www.stedi.com/app/settings/api-keys) in your Stedi account.
   - `STASH_KEYPSPACE_NAME_GS1`: A Stash keyspace name, where the function will persist unique serial numbers for inclusion on the label.
   - `LABEL_BUCKET_NAME`: A Stedi Bucket name, where the function will persist the generated label in both .zpl and .pdf formats.

   Example `.env` file

   ```
    STEDI_API_KEY=<YOUR_STEDI_API_KEY>
    LABEL_BUCKET_NAME=<A_STEDI_BUCKET_NAME>
    STASH_KEYPSPACE_NAME_GS1=<A_STEDI_KEYSPACE_NAME>
   ```

1. Run the following command in the root directory:

```bash
npm run deploy
```
