var filters = {
  all: function (todo) {
    return true
  },
  active: function (todo) {
    return todo.isCompleted === false;
  },
  completed: function (todo) {
    return todo.isCompleted === true;
  }
}

var todoApp = new Vue({
  "el": "#todoApp",
  data: {
    todos: [{
        isCompleted: true,
        content: "something to do 1."
      },
      {
        isCompleted: false,
        content: "something to do 2."
      },
      {
        isCompleted: true,
        content: "something to do 3."
      }
    ],
    visibility: 'all',
    newTodo: '',
    editingTodo: null
  },
  computed: {
    completed: function () {
      let completedNum = 0;
      for (todo of this.todos) {
        if (todo.isCompleted === true) {
          completedNum++;
        }
      }
      return completedNum;
    },
    unCompleted: function () {
      let unCompletedNum = 0;
      for (todo of this.todos) {
        if (todo.isCompleted === false) {
          unCompletedNum++;
        }
      }
      return unCompletedNum;
    },
    allDone: {
      //这个alldone用的真是妙...
      get: function () {
        return this.unCompleted === 0
        //没有未完成的,也就是全部完成了(alldone)
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.isCompleted = value;
        })
      }
    },
    filteredTodos: function () {
      return this.todos.filter(filters[this.visibility]);
    }
  },
  methods: {
    startEdit: function (todo) {
      this.editingTodo = todo;
      this.beforeEditCache = todo.content;
    },
    doneEdit: function (todo) {
      this.editingTodo = null;
      todo.content = todo.content.trim();
      if (!todo.content) {
        destroyTodo(todo);
      }
    },
    dropEdit: function(todo){
      this.editingTodo = null;
      todo.content = this.beforeEditCache;
    },
    appendTodo: function (event) {
      let value = this.newTodo;
      if (!value) {
        return;
      }
      this.todos.push({
        isCompleted: false,
        content: value
      });
      this.newTodo = '';
    },
    destroyTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
      //从该todo的索引位置开始删除,删除一个元素
    },
    clearCompleted: function () {
      //过滤出未完成的todo,然后赋给this.todos就行
      this.todos = this.todos.filter(filters.active);
      //如果要使用遍历-splice删除的话,因为在删除过程中数组的长度会改变,就有点麻烦
    }
  },
  directives: {
    'todo-focus':function(el,binding){
      if(binding.value){
        //bindinf.value就是这个指令的值得计算结果.
        el.focus();
      }
    }
  }
})