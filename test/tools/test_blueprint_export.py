import json
from pathlib import Path
import subprocess
import tempfile
import unittest


TOOLS = Path(__file__).resolve().parents[2] / 'tools'


class BlueprintExportTests(unittest.TestCase):
    def export(self, source):
        with tempfile.TemporaryDirectory() as directory:
            blueprint = Path(directory) / 'UEL0101_unit.bp'
            blueprint.write_text(source, encoding='utf-8')
            return subprocess.run(
                ['lua', 'blueprint2json.lua', str(blueprint)],
                cwd=TOOLS, capture_output=True, text=True,
            )

    def test_static_blueprint_with_supporting_lua_code(self):
        result = self.export('''
            # Blueprint comments also use this syntax.
            local health = 100
            UnitBlueprint {
                Description = '<LOC example>Example unit',
                Defense = { MaxHealth = health },
            }
            local afterDeclaration = true
        ''')
        self.assertEqual(result.returncode, 0, result.stderr)
        blueprint = json.loads(result.stdout)
        self.assertEqual(blueprint['Id'], 'UEL0101')
        self.assertEqual(blueprint['Description'], 'Example unit')
        self.assertEqual(blueprint['Defense']['MaxHealth'], 100)

    def test_callback_only_blueprint_produces_no_static_unit(self):
        result = self.export('''
            SetModBlueprintFunction(function(allBlueprints)
                error('Engine callback must not run in the static exporter')
            end)
            local previous = PostModBlueprints
            function PostModBlueprints(allBlueprints)
                return previous(allBlueprints)
            end
        ''')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, '')

    def test_invalid_blueprint_fails_without_json_output(self):
        result = self.export('UnitBlueprint { broken = }')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(result.stdout, '')
        self.assertIn('unexpected symbol', result.stderr)

    def test_generation_fails_when_blueprint_cannot_be_parsed(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            units = root / 'units' / 'UEL0101'
            units.mkdir(parents=True)
            (units / 'UEL0101_unit.bp').write_text('UnitBlueprint { broken = }')
            lua_dir = root / 'lua'
            lua_dir.mkdir()
            (lua_dir / 'version.lua').write_text('function GetVersion() return 14 end')
            target = root / 'app'
            (target / 'data').mkdir(parents=True)
            result = subprocess.run(
                ['pwsh', '-NoProfile', '-File', str(TOOLS / 'index.ps1'),
                 '-target', str(target), '-inputUnits', str(units.parent),
                 '-inputLua', str(lua_dir)],
                cwd=TOOLS, capture_output=True, text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Failed to export blueprint', result.stderr)
            self.assertFalse((target / 'data' / 'index.json').exists())


if __name__ == '__main__':
    unittest.main()
