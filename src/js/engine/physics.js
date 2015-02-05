/*jslint bitwise: true */
define(['lib/box2dWeb'],
	function() {
		var createPhysicsEngine = function() {
      /*jshint camelcase: false */
			var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2FilterData = Box2D.Dynamics.b2FilterData,
        b2World = Box2D.Dynamics.b2World,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2Listener = Box2D.Dynamics.b2ContactListener,
        b2DynamicBody = b2Body.b2_dynamicBody,
        b2KinematicBody = b2Body.b2_kinematicBody,
        b2StaticBody = b2Body.b2_staticBody,
        debugEShapeBit = b2DebugDraw.e_shapeBit,
        debugEJointBit = b2DebugDraw.e_jointBit
        ;
      /*jshint camelcase: true */

      // TODO: UNIT TEST!!
			var engine = {
        SCALE: 30.0,
				world: {},
				init: function() {
					engine.world = new b2World(new b2Vec2(0, 0), true);

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
          var listener = new b2Listener();
          listener.PostSolve = function (contact, impulse) {
            engine.postSolve(contact.GetFixtureA().GetBody(),
                      contact.GetFixtureB().GetBody(),
                      impulse.normalImpulses[0]);
          };
          engine.world.SetContactListener(listener);

         	//setup debug draw
          var debugDraw = new b2DebugDraw();
          var debugCanvas = document.getElementById('debugCanvas');
          // Don't neeed debug for unit tests
          if(debugCanvas) {
            debugDraw.SetSprite(debugCanvas.getContext('2d'));
            debugDraw.SetDrawScale(engine.SCALE);
            debugDraw.SetFillAlpha(0.7);
            debugDraw.SetLineThickness(1.0);
            /*jslint bitwise: true */
            debugDraw.SetFlags(debugEShapeBit | debugEJointBit);
            /*jslint bitwise: false */
            engine.world.SetDebugDraw(debugDraw);
          }
				},
        // TODO: UNIT TEST!!
        postSolve: function (bodyA, bodyB, impulse) {
          var uA = bodyA ? bodyA.GetUserData() : null;
          var uB = bodyB ? bodyB.GetUserData() : null;

          if(uA !== null) {
            var entityA = uA.entity;
            if(entityA !== null && entityA.onTouch) {
              entityA.onTouch(bodyB, impulse);
            }
          }
          if(uB !== null) {
            var entityB = uB.entity;
            if(entityB !== null && entityB.onTouch) {
              entityB.onTouch(bodyA, impulse);
            }
          }
        },
        addBody: function(physBodyDef) {
          var fixtureDef = new b2FixtureDef();
          fixtureDef.density = physBodyDef.density;
          fixtureDef.friction = physBodyDef.friction;
          fixtureDef.restitution = physBodyDef.restitution;
          fixtureDef.shape = new b2PolygonShape();
          fixtureDef.shape.SetAsBox(physBodyDef.halfWidth / engine.SCALE,
            physBodyDef.halfHeight / engine.SCALE);
          var filter = new b2FilterData();
          filter.groupIndex = physBodyDef.groupIndex;
          fixtureDef.filter = filter;

          var bodyDef = new b2BodyDef();
          if(physBodyDef.type === 'dynamic') {
            bodyDef.type = b2DynamicBody;
          }
          else if(physBodyDef.type === 'kinematic') {
            bodyDef.type = b2KinematicBody;
          }
          else {
            bodyDef.type = b2StaticBody;
          }
          bodyDef.position.Set(physBodyDef.pos.x / engine.SCALE, physBodyDef.pos.y / engine.SCALE);

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

          // Update all the physics bodies
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
