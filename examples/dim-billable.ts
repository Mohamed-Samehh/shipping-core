// examples/dim-billable.ts
//
// Calculate billable weight (max of actual and dimensional) for a couple of
// real-world parcels and show how the per-carrier dim factor affects the
// outcome.

import { dimensions, formatWeight, weight } from '../src/lib/weight';
import { dimensionalWeight, billableWeight } from '../src/lib/dim-weight';

function row(label: string, lengthCm: number, widthCm: number, heightCm: number,
  actualKg: number, dimFactor: number): void {
  const dim = dimensions(lengthCm * 10, widthCm * 10, heightCm * 10, 'mm');
  const actual = weight(actualKg, 'kg');
  const dimW = dimensionalWeight(dim, dimFactor);
  const billable = billableWeight(dim, actual, dimFactor);
  console.log(
    label,
    '| actual ' + formatWeight(actual, 'kg'),
    '| dim ' + formatWeight(dimW, 'kg'),
    '| billable ' + formatWeight(billable, 'kg'),
  );
}

function main(): void {
  console.log('Dim factor 5000 (UPS / FedEx / DHL):');
  row('Shoebox', 33, 22, 13, 0.8, 5000);
  row('TV box',  120, 80, 20, 12, 5000);
  row('Pillow box', 70, 50, 35, 0.5, 5000);

  console.log('\nDim factor 6000 (USPS legacy):');
  row('Shoebox', 33, 22, 13, 0.8, 6000);
  row('TV box', 120, 80, 20, 12, 6000);
  row('Pillow box', 70, 50, 35, 0.5, 6000);
}

main();
