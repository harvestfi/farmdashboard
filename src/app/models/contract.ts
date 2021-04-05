export class Contract {
  address: string;
  created: number;
  id: number;
  name: string;
  type: number;
  prettyName() {
    return this.name
        ?.replace('SUSHI_', '')
        ?.replace('ONEINCH_', '')
        ?.replace('UNI_LP_', '')
        ?.replace('UNI_', '')
        ?.replace('ST_', '')
        ?.replace('_HODL', '_H')
        ?.replace('HODL', 'SUSHI_HODL');
  };
}
