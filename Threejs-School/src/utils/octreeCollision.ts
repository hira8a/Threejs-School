import { Clock, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { Octree } from 'three/examples/jsm/math/Octree.js'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
interface iCapsule {
  start: Vector3,
  end: Vector3,
  radius: number
}
class CollisionController {
  private clock: Clock // 时钟
  private camera: PerspectiveCamera // 相机
  private collisionGroup: Object3D// 需要计算碰撞检测的组
  private canvas: HTMLCanvasElement
  private GRAVITY: number // 重力
  private STEPS_PER_FRAME: number // 每秒步数
  private worldOctree: Octree// 环境八叉树
  private playerCollider!: Capsule // 玩家碰撞体积（公开方法，setter和getter在下面）
  private playerOnFloor: boolean// 玩家是不是在地面上
  private playerVelocity: Vector3// 玩家速度
  private playerDirection: Vector3// 玩家方向
  private _position!: Vector3
  private eventStates = { // 事件状态
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    Space: false,
    mouseDown: false
  }

  /**
   * @Descripttion:
   * @param {PerspectiveCamera} camera 相机
   * @param {HTMLCanvasElement} canvas 画布
   * @param {iCapsule} capsuleParam 碰撞体积
   * @param {Object3D} collisionGroup 需要检测碰撞的组
   * @param {Vector3} position 位置
   * @return {*}
   */
  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement, capsuleParam: iCapsule, collisionGroup: Object3D, position?: Vector3) {
    this.clock = new Clock()
    this.GRAVITY = 10
    this.STEPS_PER_FRAME = 5
    this.worldOctree = new Octree()
    this.playerOnFloor = false
    this.playerCollider = new Capsule(capsuleParam.start, capsuleParam.end, capsuleParam.radius)
    this.playerVelocity = new Vector3()
    this.playerDirection = new Vector3()
    this.camera = camera
    this.camera.rotation.order = 'YXZ' // 相机旋转方式需要调整一下
    this.collisionGroup = collisionGroup
    this.canvas = canvas
    this.position = position || new Vector3(20, 0, 0)
    // this.initWorld() // 初始化碰撞检测
    // this.initEventListener() // 初始化事件侦听
  }

  /**
   * @Descripttion: 初始化碰撞
   * @return {*}
   */
  public initWorld() {
    this.worldOctree.fromGraphNode(this.collisionGroup)
  }

  private eventKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
        this.eventStates[event.code] = true
        break
      case 'KeyA':
        this.eventStates[event.code] = true
        break
      case 'KeyS':
        this.eventStates[event.code] = true
        break
      case 'KeyD':
        this.eventStates[event.code] = true
        break
      case 'Space':
        this.eventStates[event.code] = true
        break
      default:
        break
    }
  }

  private eventKetUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
        this.eventStates[event.code] = false
        break
      case 'KeyA':
        this.eventStates[event.code] = false
        break
      case 'KeyS':
        this.eventStates[event.code] = false
        break
      case 'KeyD':
        this.eventStates[event.code] = false
        break
      case 'Space':
        this.eventStates[event.code] = false
        break
      default:
        break
    }
  }

  private eventMouseDown = () => {
    this.canvas.requestPointerLock()
    this.eventStates.mouseDown = true
  }

  private eventMouseUp = () => {
    document.exitPointerLock()
    this.eventStates.mouseDown = false
  }

  private eventMouseMove = (event: MouseEvent) => {
    if (this.eventStates.mouseDown) {
      this.camera.rotation.y -= event.movementX / 500
      this.camera.rotation.x -= event.movementY / 500
    }
  }

  /**
   * @Descripttion: 初始化按键侦听
   * @return {*}
   */
  public initEventListener() {
    // 键盘按下
    document.addEventListener('keydown', this.eventKeyDown)
    // 键盘抬起
    document.addEventListener('keyup', this.eventKetUp)
    // 鼠标按下
    this.canvas.addEventListener('mousedown', this.eventMouseDown)
    // 鼠标抬起
    this.canvas.addEventListener('mouseup', this.eventMouseUp)
    // 鼠标移动
    this.canvas.addEventListener('mousemove', this.eventMouseMove)
  }

  /**
   * @description: 移除按键监听
   * @returns {*}
   */
  public clearEventListener() {
    //移除键盘按下
    document.removeEventListener('keydown', this.eventKeyDown)
    //移除键盘抬起
    document.removeEventListener('keyup', this.eventKetUp)
    //移除鼠标按下
    this.canvas.removeEventListener('mousedown', this.eventMouseDown)
    //移除鼠标抬起
    this.canvas.removeEventListener('mouseup', this.eventMouseUp)
    //移除鼠标移动
    this.canvas.removeEventListener('mousemove', this.eventMouseMove)
  }

  /**
   * @Descripttion: 玩家碰撞
   * @return {*}
   */
  private playerCollisions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCollider)
    this.playerOnFloor = false
    if (result) {
      this.playerOnFloor = result.normal.y > 0
      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(result.normal, -result.normal.dot(this.playerVelocity))
      }
      this.playerCollider.translate(result.normal.multiplyScalar(result.depth))
    }
  }

  /**
   * @Descripttion: 更新玩家
   * @return {*}
   */
  private updatePlayer(deltaTime: number) {
    let damping = Math.exp(-4 * deltaTime) - 1
    if (!this.playerOnFloor) {
      this.playerVelocity.y -= this.GRAVITY * deltaTime
      damping *= 0.1
    }
    this.playerVelocity.addScaledVector(this.playerVelocity, damping)
    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime)
    this.playerCollider.translate(deltaPosition)
    this.playerCollisions()
    this.camera.position.copy(this.playerCollider.end)
  }

  /**
   * @Descripttion: 获得前后方向
   * @return {*}
   */
  private getForwardVector() {
    this.camera.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()

    return this.playerDirection
  }

  /**
   * @Descripttion: 获得左右方向
   * @return {*}
   */
  private getSideVector() {
    this.camera.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()
    this.playerDirection.cross(this.camera.up)

    return this.playerDirection
  }

  /**
   * @Descripttion: 控制器
   * @param {number} deltaTime
   * @return {*}
   */
  private controls(deltaTime: number) {
    // gives a bit of air control
    const speedDelta = deltaTime * (this.playerOnFloor ? 25 : 8)

    if (this.eventStates.KeyW) {
      this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta))
    }

    if (this.eventStates.KeyS) {
      this.playerVelocity.add(this.getForwardVector().multiplyScalar(-speedDelta))
    }

    if (this.eventStates.KeyA) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta))
    }

    if (this.eventStates.KeyD) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta))
    }

    if (this.playerOnFloor) {
      if (this.eventStates.Space) {
        this.playerVelocity.y = 5
      }
    }
  }

  /**
   * @description: 检测玩家是否还存在模型内部
   * @return {*}
   */
  private teleportPlayerIfOob() {
    if (this.playerVelocity.y <= -15) {
      this.playerCollider.start.set(0, 0.35, 0)
      this.playerCollider.end.set(0, 1, 0)
      this.playerCollider.radius = 0.35
      this.camera.position.copy(this.playerCollider.end)
      this.camera.rotation.set(0, 0, 0)
    }
  }

  /**
   * @Descripttion: 更新控制器
   * @return {*}
   */
  public update() {
    const deltaTime = Math.min(0.05, this.clock.getDelta()) / this.STEPS_PER_FRAME
    for (let i = 0; i < this.STEPS_PER_FRAME; i++) {
      this.controls(deltaTime)
      this.updatePlayer(deltaTime)
      this.teleportPlayerIfOob()
    }
  }

  /**
   * @Descripttion: getter & setter
   */
  public get position(): Vector3 {
    return this._position
  }

  public set position(value: Vector3) {
    this.playerCollider.translate(value)
    this._position = value
  }
}
export { CollisionController }