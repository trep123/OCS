import type { Platform } from './types';
import { chaoxing } from './chaoxing';
import { zhihuishu } from './zhihuishu';
import { icve } from './icve';
import { icourse163 } from './icourse163';
import { yuketang } from './yuketang';

export const PLATFORMS: Platform[] = [chaoxing, zhihuishu, icve, icourse163, yuketang];

export function matchPlatform(url: URL): Platform | undefined {
	return PLATFORMS.find((p) => p.detect(url));
}

export type { Platform, PlatformSession } from './types';
