//= require extensions/array
//= require filtered_search/dropdown_utils
//= require filtered_search/filtered_search_tokenizer
//= require filtered_search/filtered_search_dropdown_manager

(() => {
  describe('Dropdown Utils', () => {
    describe('getEscapedText', () => {
      it('should return same word when it has no space', () => {
        const escaped = gl.DropdownUtils.getEscapedText('textWithoutSpace');
        expect(escaped).toBe('textWithoutSpace');
      });

      it('should escape with double quotes', () => {
        let escaped = gl.DropdownUtils.getEscapedText('text with space');
        expect(escaped).toBe('"text with space"');

        escaped = gl.DropdownUtils.getEscapedText('won\'t fix');
        expect(escaped).toBe('"won\'t fix"');
      });

      it('should escape with single quotes', () => {
        const escaped = gl.DropdownUtils.getEscapedText('won"t fix');
        expect(escaped).toBe('\'won"t fix\'');
      });

      it('should escape with single quotes by default', () => {
        const escaped = gl.DropdownUtils.getEscapedText('won"t\' fix');
        expect(escaped).toBe('\'won"t\' fix\'');
      });
    });

    describe('filterWithSymbol', () => {
      let input;
      const item = {
        title: '@root',
      };

      beforeEach(() => {
        setFixtures(`
          <input type="text" id="test" />
        `);

        input = document.getElementById('test');
      });

      it('should filter without symbol', () => {
        input.value = ':roo';

        const updatedItem = gl.DropdownUtils.filterWithSymbol('@', input, item);
        expect(updatedItem.droplab_hidden).toBe(false);
      });

      it('should filter with symbol', () => {
        input.value = '@roo';

        const updatedItem = gl.DropdownUtils.filterWithSymbol('@', input, item);
        expect(updatedItem.droplab_hidden).toBe(false);
      });

      it('should filter with colon', () => {
        input.value = 'roo';

        const updatedItem = gl.DropdownUtils.filterWithSymbol('@', input, item);
        expect(updatedItem.droplab_hidden).toBe(false);
      });
    });

    describe('filterHint', () => {
      let input;

      beforeEach(() => {
        setFixtures(`
          <input type="text" id="test" />
        `);

        input = document.getElementById('test');
      });

      it('should filter', () => {
        input.value = 'l';
        let updatedItem = gl.DropdownUtils.filterHint(input, {
          hint: 'label',
        });
        expect(updatedItem.droplab_hidden).toBe(false);

        input.value = 'o';
        updatedItem = gl.DropdownUtils.filterHint(input, {
          hint: 'label',
        }, 'o');
        expect(updatedItem.droplab_hidden).toBe(true);
      });

      it('should return droplab_hidden false when item has no hint', () => {
        const updatedItem = gl.DropdownUtils.filterHint(input, {}, '');
        expect(updatedItem.droplab_hidden).toBe(false);
      });
    });

    describe('setDataValueIfSelected', () => {
      beforeEach(() => {
        spyOn(gl.FilteredSearchDropdownManager, 'addWordToInput')
          .and.callFake(() => {});
      });

      it('calls addWordToInput when dataValue exists', () => {
        const selected = {
          getAttribute: () => 'value',
        };

        gl.DropdownUtils.setDataValueIfSelected(null, selected);
        expect(gl.FilteredSearchDropdownManager.addWordToInput.calls.count()).toEqual(1);
      });

      it('returns true when dataValue exists', () => {
        const selected = {
          getAttribute: () => 'value',
        };

        const result = gl.DropdownUtils.setDataValueIfSelected(null, selected);
        expect(result).toBe(true);
      });

      it('returns false when dataValue does not exist', () => {
        const selected = {
          getAttribute: () => null,
        };

        const result = gl.DropdownUtils.setDataValueIfSelected(null, selected);
        expect(result).toBe(false);
      });
    });
  });
})();
