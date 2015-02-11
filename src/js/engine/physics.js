/*jslint bitwise: true */
define(['include/box2d'],
	function(box2d) {
		var createPhysicsEngine = function() {

      // TODO: UNIT TEST!!
			var engine = {
				world: {},
				init: function() {
					engine.world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);

          // Ground
          var groundPhysBodyDef = {
            density: 1.0,
            friction: 0.5,
            restitution: 0.2,
            halfWidth: 375,
            halfHeight: 15,
            groupIndex: null,
            pos: { x: 375, y: 390},
            type: 'static',
            userData: {
              'id': 'ground',
              'entity': null
            }
          };
          engine.addBody(groundPhysBodyDef);

          // Walls
          var wallPhysBodyDef = {
            density: 1.0,
            friction: 0.5,
            restitution: 0.2,
            halfWidth: 15,
            halfHeight: 200,
            groupIndex: null,
            pos: { x: 15, y: 200},
            type: 'static',
            userData: {
              'id': 'wall',
              'entity': null
            }
          };
          engine.addBody(wallPhysBodyDef);
          wallPhysBodyDef.pos.x = 735;
          wallPhysBodyDef.pos.y = 200;
          engine.addBody(wallPhysBodyDef);

          // Listener
          var listener = new box2d.b2Listener();
          listener.PreSolve = function (contact) {
            engine.preSolve(contact);
          };
          listener.PostSolve = function (contact, impulse) {
            engine.postSolve(contact.GetFixtureA().GetBody(),
                      contact.GetFixtureB().GetBody(),
                      impulse.normalImpulses[0]);
          };
          engine.world.SetContactListener(listener);

         	//setup debug draw
          var debugDraw = new box2d.b2DebugDraw();
          var debugCanvas = document.getElementById('debugCanvas');
          // Don't neeed debug for unit tests
          if(typeof debugCanvas !== undefined && debugCanvas !== null) {
            debugDraw.SetSprite(debugCanvas.getContext('2d'));
            debugDraw.SetDrawScale(box2d.SCALE);
            debugDraw.SetFillAlpha(0.7);
            debugDraw.SetLineThickness(1.0);
            /*jslint bitwise: true */
            debugDraw.SetFlags(box2d.debugEShapeBit | box2d.debugEJointBit);
            /*jslint bitwise: false */
            engine.world.SetDebugDraw(debugDraw);
          }
				},
        // TODO: UNIT TEST!!
        preSolve: function(contact) {
          var cancelCb = function() {
            contact.SetEnabled(false);
          };
          var bodyA = contact.GetFixtureA().GetBody();
          var bodyB = contact.GetFixtureB().GetBody();

          var uA = bodyA ? bodyA.GetUserData() : null;
          var uB = bodyB ? bodyB.GetUserData() : null;
          if(uA !== null) {
            var entityA = uA.entity;
            if(entityA !== null && entityA.onTouchStart) {
              entityA.onTouchStart(bodyB, cancelCb);
            }
          }
          if(uB !== null) {
            var entityB = uB.entity;
            if(entityB !== null && entityB.onTouchStart) {
              entityB.onTouchStart(bodyA, cancelCb);
            }
          }
        },
        // TODO: UNIT TEST!!
        postSolve: function(bodyA, bodyB, impulse) {
          var uA = bodyA ? bodyA.GetUserData() : null;
          var uB = bodyB ? bodyB.GetUserData() : null;

          if(uA !== null) {
            var entityA = uA.entity;
            if(entityA !== null && entityA.onTouchFinished) {
              entityA.onTouchFinished(bodyB, impulse);
            }
          }
          if(uB !== null) {
            var entityB = uB.entity;
            if(entityB !== null && entityB.onTouchFinished) {
              entityB.onTouchFinished(bodyA, impulse);
            }
          }
        },
        addBody: function(physBodyDef) {
          var fixtureDef = new box2d.b2FixtureDef();
          fixtureDef.density = physBodyDef.density;
          fixtureDef.friction = physBodyDef.friction;
          fixtureDef.restitution = physBodyDef.restitution;
          fixtureDef.shape = new box2d.b2PolygonShape();
          fixtureDef.shape.SetAsBox(physBodyDef.halfWidth / box2d.SCALE,
            physBodyDef.halfHeight / box2d.SCALE);
          var filter = new box2d.b2FilterData();
          filter.groupIndex = physBodyDef.groupIndex;
          fixtureDef.filter = filter;
          if(physBodyDef.isBullet !== null) {
            fixtureDef.IsBullet = physBodyDef.isBullet;
          }

          var bodyDef = new box2d.b2BodyDef();
          if(physBodyDef.type === 'dynamic') {
            bodyDef.type = box2d.b2DynamicBody;
          }
          else if(physBodyDef.type === 'kinematic') {
            bodyDef.type = box2d.b2KinematicBody;
          }
          else {
            bodyDef.type = box2d.b2StaticBody;
          }
          bodyDef.position.Set(physBodyDef.pos.x / box2d.SCALE, physBodyDef.pos.y / box2d.SCALE);

          var body = engine.world.CreateBody(bodyDef);
          body.CreateFixture(fixtureDef);
          if(physBodyDef.userData) {
            body.SetUserData(physBodyDef.userData);
          }
          return body;
        },
				removeBody: function(body) {
					engine.world.DestroyBody(body);
				},
				update: function(actions) {
          var data = { actions: actions };

          // Step through the world
          engine.world.Step(
            1 / 60,  //frame-rate
            10,     //velocity iterations
            10     //position iterations
          );

          engine.world.DrawDebugData();
          engine.world.ClearForces();

          // Update all entities that have physics bodies
          for (var body = engine.world.GetBodyList(); body; body = body.GetNext()) {
            var userData = body.GetUserData();
            if(userData) {
              var entity = userData.entity;
              if(entity) {
                entity.update(data);
              }
            }
          }
				},
			};
			return engine;
		};
		return createPhysicsEngine();
	}
);
