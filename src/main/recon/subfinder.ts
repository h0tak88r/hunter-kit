/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import util from 'util';
import { exec } from 'child_process';
import path from 'path';
import { toolPath } from '../util';
import { PROJECT_DIR, appendDateToJson } from '../api/project';

const execAsync = util.promisify(exec);

export async function subFinder(
  domains: string | string[],
  outputDir: string = PROJECT_DIR,
): Promise<{ message: string; success: boolean; error: any }> {
  const subfinderPath = toolPath('subfinder');
  let command = '';
  if (typeof domains === 'string') {
    command = `${subfinderPath} -d ${domains} >> ${path.join(
      outputDir,
      'recon_subdomins.txt',
    )}`;
  } else {
    const domainsSpread = `${domains.reduce((prev, curr) => `${prev} ${curr}`)}`;
    command = `${subfinderPath} -d ${domainsSpread} >> ${path.join(
      outputDir,
      'recon_subdomins.txt',
    )}`;
  }

  try {
    await execAsync(command);
    appendDateToJson(outputDir, { subFinder: true });
    return { message: 'Done', success: true, error: '' };
  } catch (error: any) {
    return { message: 'Error', success: false, error };
  }
}
