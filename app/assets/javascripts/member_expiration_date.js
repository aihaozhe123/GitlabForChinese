/* global Pikaday */
/* global dateFormat */
(() => {
  // Add datepickers to all `js-access-expiration-date` elements. If those elements are
  // children of an element with the `clearable-input` class, and have a sibling
  // `js-clear-input` element, then show that element when there is a value in the
  // datepicker, and make clicking on that element clear the field.
  //
  window.gl = window.gl || {};
  gl.MemberExpirationDate = (selector = '.js-access-expiration-date') => {
    function toggleClearInput() {
      $(this).closest('.clearable-input').toggleClass('has-value', $(this).val() !== '');
    }
    const inputs = $(selector);

    inputs.each((i, el) => {
      const $input = $(el);

      const calendar = new Pikaday({
        field: $input.get(0),
        theme: 'gitlab-theme',
        format: 'yyyy-mm-dd',
        i18n: {previousMonth:'上个月',nextMonth:'下个月',months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],weekdays:['周日','周一','周二','周三','周四','周五','周六'],weekdaysShort:['日','一','二','三','四','五','六']},
        minDate: new Date(),
        onSelect(dateText) {
          $input.val(dateFormat(new Date(dateText), 'yyyy-mm-dd'));

          $input.trigger('change');

          toggleClearInput.call($input);
        },
      });

      calendar.setDate(new Date($input.val()));
      $input.data('pikaday', calendar);
    });

    inputs.next('.js-clear-input').on('click', function clicked(event) {
      event.preventDefault();

      const input = $(this).closest('.clearable-input').find(selector);
      const calendar = input.data('pikaday');

      calendar.setDate(null);
      input.trigger('change');
      toggleClearInput.call(input);
    });

    inputs.on('blur', toggleClearInput);

    inputs.each(toggleClearInput);
  };
}).call(window);
