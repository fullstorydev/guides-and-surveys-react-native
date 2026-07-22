// plugins/withFmtFix.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

const withFmtFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );
      if (!fs.existsSync(podfilePath)) return config;

      let content = fs.readFileSync(podfilePath, 'utf-8');
      if (content.includes('FMT_USE_CONSTEVAL')) return config;

      const patchCode = `
    # Fix fmt 11.0.2 consteval compilation error with Xcode 26.4+
    fmt_base = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base)
      content = File.read(fmt_base)
      patched = content.gsub(/^#\\s*define FMT_USE_CONSTEVAL 1$/, '# define FMT_USE_CONSTEVAL 0')
      if patched != content
        File.chmod(0644, fmt_base)
        File.write(fmt_base, patched)
      end
    end`;

      // Insert after react_native_post_install(...). The upstream workaround regex
      // expected a second ")" then immediate `end`/`end`, which does not match
      // current Expo Podfiles (CODE_SIGNING_ALLOWED block in between).
      const next = content.replace(
        /(react_native_post_install\([\s\S]*?\n\s*\))/,
        `$1\n${patchCode}`
      );
      if (next === content) {
        console.warn(
          '[withFmtFix] Could not locate react_native_post_install(...) in Podfile; fmt patch not applied'
        );
        return config;
      }

      fs.writeFileSync(podfilePath, next);
      return config;
    },
  ]);
};

module.exports = withFmtFix;
