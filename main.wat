(module

  ;; Export linear memory 
  (memory $memory 1)
  (export "memory" (memory $memory))

  (func $add (export "add") (param i32 i32) (result i32)
    (i32.add (local.get 0) (local.get 1))
  )
  (func $store (export "store") (param) (result)
    ;; (i32.store (i32.const 0) (i32.const 0) (local.get $val))
    i32.const 2 ;; align
    i32.const 0 ;; offset
    i32.const 10 ;; value
    i32.store
    drop

    i32.const 2 ;; align
    i32.const 4 ;; offset
    i32.const 20 ;; value
    i32.store
    drop
  )
  (func $newArr (export "newArr") (param $length i32) (param $initialValue i32) (result i32)
    (local $i i32)
    (local.set $i (i32.const 0))

    (block
      (loop
        (i32.store 
          (i32.const 2)     ;; alignment
          (i32.mul          ;; offset
            (local.get $i)  ;; multiply i by 4 because i is the byte index and length is 32-bit ints
            (i32.const 4)) 
          (local.get $initialValue))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))

        ;; if condition is true, jump out 1 level of nesting (to the end of `block`), which ends execution
        (br_if 1 (i32.eq (local.get $i) (local.get $length)))
        ;; jump to the current level of nesting (to the beginning `loop`)
        (br 0)
      ))
    (return (i32.const 0)))

  ;; totally fails haha
  (func $incArr (export "incArr") (param $ptr i32) (param $length i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    
    (block
      (loop
        (i32.store
          (i32.const 2) ;; align
          ;; offset: add 4*i to the ptr to get specific location
          (i32.add
            (local.get $ptr)
            (i32.mul (i32.const 4) (local.get $i)))
          ;; this is our updated value now
          (i32.add 
            (i32.const 1)
            ;; get the value to update
            (i32.load 
              (i32.const 2) ;; align
              ;; offset: add 4*i to the ptr to get specific location
              (i32.add
                (local.get $ptr)
                (i32.mul (i32.const 4) (local.get $i))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        
        (br_if 1 (i32.eq (local.get $i) (local.get $length)))
        (br 0)
      ))
  )
  
  ;; params: length, initialValue
  ;; (func $newArr (export "newArr") (param $length i32) (param $initialValue i32) (result i32)

  ;; )
)
