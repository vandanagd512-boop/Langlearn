import { ILangLearnPlugin, PluginContext } from './plugin.types';
import { logger } from '@/services/logging/logger.service';

export class PluginManager {
  private plugins = new Map<string, ILangLearnPlugin>();
  private activePluginIds = new Set<string>();

  public register(plugin: ILangLearnPlugin): void {
    const id = plugin.manifest.id;
    if (this.plugins.has(id)) {
      logger.warn('PluginManager', `Plugin ${id} is already registered. Overwriting.`);
    }
    this.plugins.set(id, plugin);
    if (plugin.manifest.enabledByDefault) {
      this.activePluginIds.add(id);
    }
    logger.info('PluginManager', `Registered plugin: ${plugin.manifest.name} (v${plugin.manifest.version})`);
  }

  public async initAll(context: PluginContext): Promise<void> {
    for (const id of this.activePluginIds) {
      const plugin = this.plugins.get(id);
      if (plugin?.onInit) {
        try {
          await plugin.onInit(context);
          logger.info('PluginManager', `Initialized plugin: ${id}`);
        } catch (err) {
          logger.error('PluginManager', `Failed to initialize plugin ${id}`, err);
        }
      }
    }
  }

  public getPlugins(): ILangLearnPlugin[] {
    return Array.from(this.plugins.values());
  }

  public isEnabled(id: string): boolean {
    return this.activePluginIds.has(id);
  }

  public enable(id: string): void {
    if (this.plugins.has(id)) {
      this.activePluginIds.add(id);
    }
  }

  public disable(id: string): void {
    this.activePluginIds.delete(id);
  }
}

export const pluginManager = new PluginManager();
